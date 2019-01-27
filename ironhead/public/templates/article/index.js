const article = ({ ssrHtml, manifest, preLoadedStateForClient, seoInfo = {} }) => (`
	<html>
		<head>
			<title>Ironhead App</title>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
			<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0">
			<meta name="ROBOTS" content="NOINDEX, NOFOLLOW">
			<meta name="format-detection" content="telephone=no">
			<link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Condensed:700" rel="stylesheet">
			<link href="${manifest['main.css']}" rel="stylesheet">
			<script>
				window.PRELOADED_STATE = ${preLoadedStateForClient}
			</script>
		</head>
		<body>
			<section id="app-root">
				${ssrHtml}
			</section>
			<script src="${manifest['main.js']}" async></script>
		</body>
	</html>
`);

module.exports = article;
