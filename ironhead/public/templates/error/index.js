const errorPage = ({ ssrHtml, manifest, preLoadedStateForClient, seoInfo = {} }) => (`
	<html>
		<head>
			<title>${seoInfo.title}</title>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
			<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0">
			<meta name="ROBOTS" content="NOINDEX, NOFOLLOW">
			<meta name="description" content="${seoInfo.description}">
			<meta name="format-detection" content="telephone=no">
			<meta name="keywords" content="${seoInfo.keywords}">
			<link rel="preconnect" href="https://www.youtube.com">
			<link rel="preconnect" href="http://tpc.googlesyndication.com">
			<link rel="preconnect" href="https://livemintapi.cmots.com">
			<link rel="icon" href="https://images.livemint.com/rw/PortalConfig/LiveMint/static_content/images/v2/livemint_favicon.png">
			<link href="${manifest['full.css']}" rel="stylesheet">
			<script>
				window.PRELOADED_STATE = ${preLoadedStateForClient}
			</script>
			<script async='async' src='https://www.googletagservices.com/tag/js/gpt.js'></script>
			<script>
				var googletag = googletag || {}; 
				googletag.cmd = googletag.cmd || [];
				googletag.cmd.push(function() {
						googletag.defineSlot('/3106570/LM_MF_WAP_AllPages_Masthead_Multisize', [[320, 50], [320, 100], [300, 100], [300, 250]], 'div-gpt-ad-1536154373501-0').addService(googletag.pubads());
						googletag.pubads().enableSingleRequest();
    					googletag.enableServices();
				});
		  	</script>
		</head>
		<body>
			<section id="app-root">
				${ssrHtml}
			</section>
			<footer></footer>
			<script src="${manifest['full.js']}" async></script>
			<script type="text/javascript">
       	 		if ('serviceWorker' in navigator) {
					window.addEventListener('DOMContentLoaded', function() {
						navigator.serviceWorker.register('/service-worker.js')
						.then(function(registration) { console.log('SW registered'); })
						.catch(function(err) { console.log('SW registration failed - ', err); });
					});
        		}
				window.addEventListener('appinstalled', function(evt) {
					ga('send', { hitType: 'event', eventCategory: 'pwa_add_to_home_screen', eventAction: 'added_to_home_screen', eventLabel: '{flow}', 'Page Technology1' : 'PWA' });
				});
			</script>
		</body>
	</html>
`);

module.exports = homePage;