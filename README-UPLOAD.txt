UPLOAD GUIDE (cPanel)  -  static HTML/CSS/JS + one PHP file. No Node.js or database needed.

1. cPanel > File Manager > public_html  (or the add-on domain's folder)
2. Upload "website-upload-ready.zip" there, then right-click > Extract.
   (Make sure the hidden file .htaccess is extracted: File Manager > Settings > Show Hidden Files.)
3. Open  api/config.php  (Edit) and set:
      $SITE_NAME, $TO_EMAIL (where enquiries arrive), $FROM_EMAIL (an email on your own domain)
4. Visit your domain and send a test message from the Contact page.
   - Every enquiry is also saved to api/data/enquiries.csv (blocked from public access).

REPLACE THE PLACEHOLDERS (the site ships with neutral placeholder details):
   Agency name ........ "Your Agency Name"
   Phone .............. "+880 1XXX-XXXXXX" / "+8801XXXXXXXXX"
   WhatsApp number .... "8801XXXXXXXXX"
   Email .............. "info@youragency.com"
   Address / city ..... "Your Office Address", "Your City"
   Domain ............. "https://www.yourdomain.com"  (canonical links, sitemap.xml, robots.txt)
Easiest way: cPanel File Manager > Code Editor, or any editor with "Find in Files / Replace All".

ALSO REVIEW BEFORE GOING LIVE
   - Tours, hotels, packages, visa prices and the 3 testimonials are SAMPLE data. Replace with the client's real offers.
   - Stats ("1000+ Happy Travelers" etc.) are sample numbers. Replace with real, true figures.
   - Photos load from Unsplash. For a real launch, download/replace them with the client's own images or licensed photos and host them in assets/.
   - Flight search is a quote request (goes to the contact form). Real flight/hotel booking needs a supplier API.
   - Turn on SSL in cPanel, then uncomment the HTTPS redirect lines in .htaccess.

EDITING CONTENT LATER
   Option A: edit the .html files directly.
   Option B (developers): source-code.zip contains data.json, config.json and build.js.
             npm install && npm run build  regenerates everything into ./dist
