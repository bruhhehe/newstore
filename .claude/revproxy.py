"""Plain-HTTP reverse proxy in front of velagoods.co.uk, so a headless browser
can exercise the real cart without doing TLS itself.

The browser talks http://127.0.0.1:8100; this process does the HTTPS through
the session's agent proxy, which already trusts the CA. Nothing about TLS is
relaxed: urllib verifies the upstream certificate exactly as curl does.
"""
import http.server, socketserver, urllib.request, urllib.error, gzip, io, re, sys

UP = 'https://velagoods.co.uk'
LOCAL = 'http://127.0.0.1:8100'
UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/124.0 Safari/537.36')

HOP = {'connection', 'keep-alive', 'transfer-encoding', 'upgrade',
       'content-encoding', 'content-length', 'strict-transport-security',
       'content-security-policy', 'content-security-policy-report-only'}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


opener = urllib.request.build_opener(NoRedirect)


class H(http.server.BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def log_message(self, *a):
        pass

    def _pass(self, body=None):
        url = UP + self.path
        req = urllib.request.Request(url, data=body, method=self.command)
        for k, v in self.headers.items():
            if k.lower() in ('host', 'accept-encoding', 'connection', 'content-length'):
                continue
            req.add_header(k, v)
        req.add_header('User-Agent', UA)
        req.add_header('Accept-Encoding', 'gzip')
        try:
            r = opener.open(req, timeout=60)
            status, hdrs, data = r.status, r.headers, r.read()
        except urllib.error.HTTPError as e:
            status, hdrs, data = e.code, e.headers, e.read()
        except Exception as e:
            self.send_response(502)
            self.end_headers()
            self.wfile.write(str(e).encode())
            return

        if hdrs.get('Content-Encoding', '').lower() == 'gzip':
            try:
                data = gzip.decompress(data)
            except Exception:
                pass

        ctype = hdrs.get('Content-Type', '')
        if any(t in ctype for t in ('text/html', 'javascript', 'application/json', 'text/css')):
            txt = data.decode('utf-8', 'replace')
            txt = txt.replace('https://velagoods.co.uk', LOCAL)
            txt = txt.replace('//velagoods.co.uk', '//127.0.0.1:8100')
            data = txt.encode('utf-8')

        self.send_response(status)
        for k, v in hdrs.items():
            if k.lower() in HOP:
                continue
            if k.lower() == 'location':
                v = v.replace('https://velagoods.co.uk', LOCAL).replace('//velagoods.co.uk', '//127.0.0.1:8100')
            if k.lower() == 'set-cookie':
                v = re.sub(r';\s*Secure', '', v, flags=re.I)
                v = re.sub(r'Domain=[^;]*;?\s*', '', v, flags=re.I)
                self.send_header('Set-Cookie', v)
                continue
            self.send_header(k, v)
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        self._pass()

    def do_HEAD(self):
        self._pass()

    def do_POST(self):
        n = int(self.headers.get('Content-Length') or 0)
        self._pass(self.rfile.read(n) if n else b'')


class S(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == '__main__':
    S(('127.0.0.1', 8100), H).serve_forever()
