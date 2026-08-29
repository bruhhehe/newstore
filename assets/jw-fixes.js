(function(){
      var host, tries = 0;
      function move(){
        var page = document.getElementById('jw-page');
        if(!page) return true;
        var live = document.querySelector('.shopify-app-block .jdgm-review-widget')
                || document.querySelector('.jdgm-review-widget.jdgm--done-setup-widget:not(.jw-rev--empty)');
        var target = document.querySelector('#reviews .wrap');
        if(!live || !target) return false;

        /* the stale manual embed and my dead href="#" button both predate this */
        document.querySelectorAll('.jw-rev--empty, #reviews #judgeme_product_reviews:not(.shopify-app-block *)').forEach(function(n){
          if(!n.closest('.shopify-app-block')) n.remove();
        });
        var dead = document.querySelector('#reviews a.jdgm-write-rev-link[href="#"]');
        if(dead && !dead.closest('.jdgm-widget')){
          var holder = dead.parentElement;
          dead.remove();
          if(holder && !holder.children.length) holder.remove();
        }

        if(!host){
          host = document.createElement('div');
          host.className = 'jw-jdgm';
          target.appendChild(host);
        }
        host.appendChild(live.closest('.shopify-app-block') || live);

        /* With no reviews the widget renders a duplicate 'Customer Reviews'
           heading, a 'No items found' line and a Write a review button whose
           modal is broken. None of that helps anyone: reviews arrive through
           Judge.me's post-purchase email, not from a button a non-buyer clicks.
           Hide it until there is something real in it. It reappears on its own. */
        var hasReviews = !!live.querySelector(
          '[class*="jm-review-card"], [class*="jm-review-item"], .jdgm-rev, .jdgm-review'
        );
        host.style.display = hasReviews ? '' : 'none';
        return true;
      }
      /* --- TEMPORARY SHIM ---------------------------------------------
         sections/jointwell-landing.liquid has stopped syncing from GitHub
         again, so copy fixes cannot reach the page through it. These two are
         corrections to text that is actively wrong, applied from the one file
         that does sync. Delete this block once the section is current. */
      function patchCopy(){
        var rev = document.getElementById('reviews');
        if(!rev) return;
        var h2 = rev.querySelector('h2');
        if(h2 && /be the first to say/i.test(h2.textContent)){
          h2.innerHTML = "You don't have to believe us. <em>That's what the 30 days are for.</em>";
        }
        var lede = rev.querySelector('p.lede');
        if(lede && /already bought one/i.test(lede.textContent)){
          lede.textContent = "When reviews start appearing here they will come through Judge.me from verified orders, which means we cannot write them, edit them, or delete the ones we would rather you did not read. Until then, the guarantee is the part you can check.";
        }
        var eb = rev.querySelector('.eyebrow');
        if(eb && /^reviews$/i.test(eb.textContent.trim())) eb.textContent = 'Proof';
        /* dead button: its modal cannot open and reviews come by email anyway */
        rev.querySelectorAll('a.jdgm-write-rev-link').forEach(function(a){
          if(a.closest('.jdgm-widget')) return;
          var holder = a.parentElement;
          a.remove();
          if(holder && !holder.children.length) holder.remove();
        });
      }
      patchCopy();
      document.addEventListener('DOMContentLoaded', patchCopy);

      var t = setInterval(function(){ patchCopy(); if(move() || ++tries > 60) clearInterval(t); }, 250);
      if(document.readyState !== 'loading') move();
      else document.addEventListener('DOMContentLoaded', move);
    })();
