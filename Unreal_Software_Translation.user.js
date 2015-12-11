// ==UserScript==
// @name        Unreal Software Translation
// @namespace   http://engin33r.net/
// @description User script for translating US.de into different languages
// @author      EngiN33R
// @match       http://*.unrealsoftware.de/
// @match       http://www.unrealsoftware.de/*
// @match       http://unrealsoftware.de/*
// @version     1
// @grant       none
// ==/UserScript==

// Setting up DOM code

var langcache = document.createElement('script');
langcache.type = 'text/javascript';
langcache.id = 'languageCache';
langcache.innerHTML = 'var strings = [];'
document.getElementsByTagName('head')[0].appendChild(langcache);

var functioninc = document.createElement('script');
functioninc.type = 'text/javascript';
functioninc.innerHTML = 'function parseTranslations() {console.log("defaultfunc")} function setTransFile(path) {'
  + 'var cookies = document.cookie.split(";");'
  + 'cookies.forEach(function(el) {'
    + 'var cookie = el.split("=");'
    + 'if (cookie[0] == "customtransfile") {'
      + 'var now = new Date();'
      + 'now.setMonth(now.getMonth() - 1);'
      + 'document.cookie = "customtransfile="+cookie[1]+"; expires="+now.toUTCString()+";";'
    + '}'
  + '});'
  + 'document.cookie = "customtransfile="+path+"; domain=.unrealsoftware.de; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";'
  + 'location.reload();'
+ '}'
+ 'function loadTransFile(path, callback) {'
  + 'var cache = $("#languageCache");'
  + 'var cachehtml = "var strings=[];";'
  + 'if (path !== undefined) {'
    + '$.get(path, function(data) {'
      + 'var lines = data.split("\\n");'
      + 'lines.forEach(function(el) {'
        + 'var tmp = el.split("=");'
        + 'if (tmp[0] != "" && tmp[1] !== undefined) {'
          + 'strings[tmp[0]] = tmp[1];'
          + 'console.log(tmp[0] + " = " + tmp[1]);'
          + 'cachehtml += "strings[\'"+tmp[0]+"\']="+tmp[1]+";";'
        + '}'
      + '});'
      + 'cache.html(cachehtml);'
      + 'callback();'
    + '});'
  + '} else {'
    + 'cookies = document.cookie.split("; ");'
    + 'cookies.forEach(function(el) {'
      + 'cookie = el.split("=");'
      + 'if (cookie[0] == "customtransfile") {'
        + 'var now = new Date();'
        + 'now.setMonth(now.getMonth() - 1);'
        + 'document.cookie = "customtransfile="+cookie[1]+"; domain=.unrealsoftware.de; expires="+now.toUTCString()+"; path=/";'
      + '}'
    + '});'
    + 'cache.html(cachehtml);'
    + 'location.reload();'
  + '}'
+ '}'
document.getElementsByTagName('head')[0].appendChild(functioninc);

// Language popup box

function langBox(h) {
  if (h) {
    $('#js_overlay_loading').css('display', 'none');
    $('#js_overlay').fadeOut(300, function() {$(this).remove();});
        $('#js_box').fadeOut(200);
  } else {
    // Set up BG and box
    
    var $div = $('#js_overlay');
    if ($div.length == 0) {
      $div = $('<div id="js_overlay" className="js_overlayBG" class="js_overlayBG" style="display:none;"><div id="js_overlay_loading" style="background:url(../img/ajax.gif) no-repeat center center; height:100%; width:100%; display:block;"></div></div>');
      $div.click(function () {
        overlay();
      });
      $div.appendTo('body');
    }
    $div.fadeIn('fast');

    var $box = $('#js_box');
    if ($box.length == 0) {
      $box = $('<div id="js_box"></div>');
      $box.appendTo('body');
    }
    $box.fadeIn('fast');

    // Set up box with translations list
    
    var request = new XMLHttpRequest();
    request.onload = function() {
      var ui_close = '<a href="javascript:overlay();" style="position: absolute; display: block; right: 5px; bottom: 5px; width: 22px; height: 22px; background-image:url(img/closelabel.gif);"></a>';
      var boxhtml = '<div style="padding: 5px; margin-bottom: 27px">'
        + '<div class="bh"><b id="langselTitle">Language file selection</b></div>'
        + '<div class="b0" style="height: 100%; height: 200px; max-height: 200px; overflow-y: scroll;">'
        + '<span id="langselCaption">You may select a translation file to use below.</span><br/><br/>'
        + '<ul style="text-align: left; margin-left: 20px; list-style-image: url(\'img/x.gif\')"><li><b><a href="javascript:loadTransFile();" id="langselDis">Disable</a></b></li></ul>'
        + '<ul style="text-align: left; margin-left: 20px; padding-bottom: 10px">';
      
      var response = JSON.parse(this.responseText);
      response.forEach(function(el, i) {
        boxhtml += '<li><b><a href="javascript:setTransFile(\''+el.download_url+'\');">'+el.name.split(".")[0]+'</a></b></li>';
      });
      
      boxhtml += "</ul></div></div>"+ui_close;
      
      $('#js_overlay_loading').hide();
      $box.html(boxhtml);
      $box.attr('style', 'width: 450px; margin-left: -150px; margin-top: -100px; display: hidden; visibility: visible;');
      
      if (strings.side_lang) {
        $('b#langselTitle').html(strings.side_langsel);
        $('span#langselCaption').html(strings.side_langselc);
        $('a#langselDis').html(strings.side_langdis);
      }
    }
    request.open('get', 'https://api.github.com/repos/Eng1N33R/usde-translation/contents/translations/', true);
    request.send();
  }
}
  
// Language selector

$('div.sidetext').after('<a class="sidetext" style="color: #000; font-weight: bold" href="#" id="selectLanguage">Other languages</a>');
$('#selectLanguage').click(function(e) { langBox(); });

/** LOADING TRANSLATIONS **/

console.log("COOKIES: " + document.cookie);

cookies = document.cookie.split("; ");
cookies.forEach(function(el) {
  cookie = el.split("=");
  if (cookie[0] == "customtransfile") {
    loadTransFile(cookie[1]+"?"+Math.floor(Math.random()*1000+1), function() {
      console.log("Loading strings");
      arr = cookie[1].split("/");
      name = arr[arr.length - 1].split(".")[0];
      
      username = $('div#header div#userarea a[href="profile.php?userid=self"]').html().split(" - ")[1];
      
      $('div#menu_end img[src="img/en1.gif"]').attr('src', "img/en0.gif");
      $('div.sidetext:contains("English")').html(name);
      
      $('div#userarea a[href="profile.php?userid=self"]').html(strings.head_profile.replace("%0", username));
      
      // Process PMs
      msgs = $('div#userarea a:contains("Messages")');
      if (msgs.html().indexOf("(") !== -1) {
        msgs.html(msgs.html().replace(/Messages \((%d)\)/, function(a){return strings.head_pm2.replace("%0", a)}));
      } else {
        msgs.html(strings.head_pm);
      }
      
      // Process friends
      friends = $('div#userarea a:contains("Friends")');
      if (friends.html().indexOf("(") !== -1) {
        friends.html(msg.html().replace(/Friends \((%d)\)/, function(a){return strings.head_friends2.replace("%0", a)}));
      } else {
        friends.html(strings.head_friends);
      }
      
      $('div#userarea a:contains("Logout")').html(strings.head_logout);
      
      headerlinks = $('div#header_links');
      headerlinks.html(headerlinks.html().replace("Network", strings.head_network))
      
      $('div.nav_l a[href="index.php"]').html(strings.lmenu_portal);
      $('div.nav_l a[href="news.php"]').html(strings.lmenu_news);
      $('div.nav_l a[href="about.php"]').html(strings.lmenu_about);
      $('div.nav_l a[href="contact.php"]').html(strings.lmenu_contact);

      $('div.nav_sec:contains("Games")').html(strings.lmenu_games);

      $('div.nav_sec:contains("Stuff")').html(strings.lmenu_stuff);
      $('div.nav_l a[href="comics.php"]').html(strings.lmenu_comics);
      $('div.nav_l a[href="links.php"]').html(strings.lmenu_links);

      $('div.nav_sec:contains("Community")').html(strings.lmenu_community);
      $('div.nav_l a[href="search.php"]').html(strings.lmenu_search);
      $('div.nav_l a[href="rules.php"]').html(strings.lmenu_rules);
      $('div.nav_l a[href="users.php"]').html(strings.lmenu_users);
      $('div.nav_l a[href="files.php"]').html(strings.lmenu_files);
      $('div.nav_l a[href="forum.php"]').html(strings.lmenu_forum);
      
      $('a#selectLanguage').html(strings.side_lang);

      $('div.hbar h1:contains("Welcome to UnrealSoftware.de")').html(strings.tbar_welcome);
      
      $('div.c2l div.bh h2:contains("Hi")').html(strings.cont_hi.replace("%0", username));
      $('div.c2l div.bh h2:contains("Latest News")').html(strings.cont_recnews);
      cmnt = $('div.b1 a.l_forum:contains("Comment")');
      cmnt.html(strings.util_comments.replace("%0", cmnt.html().split(" ")[0]));
      $('a.l_n[href="news.php"]').html(strings.cont_newsarchive);
      $('div.c2r div.bh h2:contains("Recent Forum Posts")').html(strings.cont_recposts);
      $('div.c2r div.bh h2:contains("New Uploads")').html(strings.cont_recfiles);
      $('a.l_forum[href="forum.php"]').html(strings.lmenu_forum);
      $('a.l_file[href="files.php"]').html(strings.lmenu_files);
    });
  }
});
