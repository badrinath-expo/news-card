const apiKey = ""; // will be shared via email
const generateCardButton = document.getElementById("generateCard");
const upgradeButton = document.getElementById("upgrade-container");

if (!localStorage.getItem("generations")) {
  localStorage.setItem("generations", 0); //initial
}

const fetchSummary = async () => {
  //Generations Count validation - Freemium (2 per day)
  const genCount = parseInt(localStorage.getItem("generations"));
  if (genCount === 2) {
    const statusDiv = document.getElementById("status");
    statusDiv.innerText = "Users can create up to 2 cards per day for free.";
    generateCardButton.style.display = "none";
    upgradeButton.style.display = "flex";
    return;
  }

  const url =
    "https://tldrthis.p.rapidapi.com/v1/model/abstractive/summarize-url/";

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const activeTab = tabs[0];
    const browser_url = activeTab.url;
    const urlObj = new URL(browser_url);
    const source = urlObj.hostname;
    console.log("Current Page URL:", browser_url);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "tldrthis.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
      body: JSON.stringify({
        url: browser_url,
        min_length: 100,
        max_length: 300,
        is_detailed: false,
        prompt:
          "Summarize this article to generate a header, summary(limit to 60-70 words) and an image for a news card.",
      }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data); // Logs the summarized response

      // increasing generations count
      localStorage.setItem("generations", genCount + 1);

      const { article_title, article_image, summary } = data;
      generateNewsCard(article_title, summary[0], article_image, source);
    } catch (error) {
      console.error("Error:", error);
    }
  });
};

// test
function testCard() {
  const data = {
    summary: [
      "Six years after Yahoo purchased Tumblr, its parent corporation is selling the once-dominant blogging platform. WordPress owner Automattic Inc. has agreed to take the service off of Verizon’s hands. Terms of the deal are undisclosed, but the number is “nominal,” compared to its original asking price.",
    ],
    article_text:
      "Six years after Yahoo purchased Tumblr for north of $1 billion, its parent corporation is selling the once-dominant blogging platform. WordPress owner Automattic Inc. has agreed to take the service off of Verizon’s hands. Terms of the deal are undisclosed, but the number is “nominal,” compared to its original asking price, per an article in The Wall Street Journal.\n\nAxios is reporting that the asking price for the platform is “well below $20 million,” a fraction of a fraction of its 2013 price tag.\n\nOnce the hottest game in town, the intervening half-decade has been tough on Tumblr, as sites like Facebook, Instagram, Reddit and the like have since left the platform in the dust. More recently, a decision to ban porn from the platform has had a marked negative impact on the service’s traffic. According to Sensor Tower, first-time users for Tumblr’s mobile app declined 33% year-over-year last quarter.\n\n“Tumblr is one of the Web’s most iconic brands,” Automattic CEO Matt Mullenweg said of the news. “It is an essential venue to share new ideas, cultures and experiences, helping millions create and build communities around their shared interests. We are excited to add it to our lineup, which already includes WordPress.com, WooCommerce, Jetpack, Simplenote, Longreads, and more.”\n\nThe news certainly isn’t surprising. In May, it was reported that Verizon was looking for a new owner for the site it inherited through its acquisition of Yahoo. Tumblr was Yahoo’s largest acquisition at the time, as then-CEO Marissa Mayer “promise[d] not to screw it up” in a statement made at the time.\n\nTumblr proved not to be a great fit for Yahoo — and even less so Verizon, which rolled the platform into its short-lived Oath business and later the Verizon Media Group (also TechCrunch’s umbrella company). On the face of it, at least, Automattic seems a much better match. The company runs WordPress.com, one of the internet’s most popular publishing tools, along with Jetpack and Simplenote. As part of the deal, the company will take on 200 Tumblr staffers.\n\n“We couldn’t be more excited to be joining a team that has a similar mission. Many of you know WordPress.com, Automattic’s flagship product. WordPress.com and Tumblr were both early pioneers among blogging platforms,” Tumblr fittingly wrote in a blog post. “Automattic shares our vision to build passionate communities around shared interests and to democratize publishing so that anyone with a story can tell it, especially when they come from under-heard voices and marginalized communities.”\n\n“Today’s announcement is the culmination of a thoughtful, thorough and strategic process,” Verizon Media CEO Guru Gowrappan said in a statement. “Tumblr is a marquee brand that has started movements, allowed for true identities to blossom and become home to many creative communities and fandoms. We are proud of what the team has accomplished and are happy to have found the perfect partner in Automattic, whose expertise and track record will unlock new and exciting possibilities for Tumblr and its users.”",
    article_title:
      "Verizon is selling Tumblr to WordPress.com parent, Automattic",
    article_authors: [
      "Brian Heater",
      "Hardware Editor",
      "Kyle Wiggers",
      "Anthony Ha",
      "Cody Corrall",
      "Sean O'Kane",
      "Maxwell Zeff",
      "Manish Singh",
      "Rebecca Bellan",
      "Lauren Forristal",
    ],
    article_image:
      "https://techcrunch.com/wp-content/uploads/2019/08/tumblr-phone-sold.png",
    article_pub_date: "Aug 12, 2019",
    article_url:
      "https://techcrunch.com/2019/08/12/verizon-is-selling-tumblr-to-wordpress-parent-automattic/",
    article_html:
      '<div><p id="speakable-summary">Six years after Yahoo purchased Tumblr for north of $1 billion, its parent corporation is selling the once-dominant blogging platform. WordPress owner Automattic Inc. has agreed to take the service off of Verizon&#8217;s hands. Terms of the deal are undisclosed, but the number is &#8220;nominal,&#8221; compared to its original asking price, per <a rel="nofollow" href="https://www.wsj.com/articles/verizon-to-sell-tumblr-to-wordpress-owner-11565640000">an article in The Wall Street Journal</a>.</p>\n<p><a rel="nofollow" href="https://www.axios.com/verizon-tumblr-wordpress-automattic-e6645edd-bc73-45c2-9380-9fe8ca34291f.html">Axios is reporting</a> that the asking price for the platform is &#8220;well below $20 million,&#8221; a fraction of a fraction of its 2013 price tag.</p>\n<p class="ad-unit__ad" id="us-tc-ros-dt-native-midarticle">\n\t</p>\n<p class="ad-unit__ad" id="us-tc-ros-mw-mid-center">\n\t</p>\n<p>Once the hottest game in town, the intervening half-decade has been tough on Tumblr, as sites like Facebook, Instagram, Reddit and the like have since left the platform in the dust. More recently, a decision to ban porn from the platform has had a marked negative impact on the service&#8217;s traffic. According to Sensor Tower, first-time users for Tumblr&#8217;s mobile app declined 33% year-over-year last quarter.</p>\n<p>&#8220;Tumblr is one of the Web&#8217;s most iconic brands,&#8221; Automattic CEO Matt Mullenweg said of the news. &#8220;It is an essential venue to share new ideas, cultures and experiences, helping millions create and build communities around their shared interests. We are excited to add it to our lineup, which already includes WordPress.com, WooCommerce, Jetpack, Simplenote, Longreads, and more.&#8221;</p>\n<p>The news certainly isn&#8217;t surprising. In May, it was reported that Verizon was looking for a new owner for the site it inherited through its acquisition of Yahoo. Tumblr was Yahoo&#8217;s largest acquisition at the time, as then-CEO Marissa Mayer &#8220;promise[d] not to screw it up&#8221; in a statement made at the time.</p>\n<p>Tumblr proved not to be a great fit for Yahoo &#8212; and even less so Verizon, which rolled the platform into its short-lived Oath business and later the Verizon Media Group (also TechCrunch&#8217;s umbrella company). On the face of it, at least, Automattic seems a much better match. The company runs WordPress.com, one of the internet&#8217;s most popular publishing tools, along with Jetpack and Simplenote. As part of the deal, the company will take on 200 Tumblr staffers.</p>\n<p>&#8220;We couldn&#8217;t be more excited to be joining a team that has a similar mission. Many of you know WordPress.com, Automattic&#8217;s flagship product. WordPress.com and Tumblr were both early pioneers among blogging platforms,&#8221; Tumblr fittingly wrote in <a rel="nofollow" href="https://staff.tumblr.com/post/186963195515/hello-tumblr-today-tumblrs-owner-verizon#notes">a blog post</a>. &#8220;Automattic shares our vision to build passionate communities around shared interests and to democratize publishing so that anyone with a story can tell it, especially when they come from under-heard voices and marginalized communities.&#8221;</p><p class="marfeel-experience-inline-cta wp-block-tc23-marfeel-experience">\n</p>\n\n<p>&#8220;Today&#8217;s announcement is the culmination of a thoughtful, thorough and strategic process,&#8221; Verizon Media CEO Guru Gowrappan said in a statement. &#8220;Tumblr is a marquee brand that has started movements, allowed for true identities to blossom and become home to many creative communities and fandoms. We are proud of what the team has accomplished and are happy to have found the perfect partner in Automattic, whose expertise and track record will unlock new and exciting possibilities for Tumblr and its users.&#8221;</p>\n</div>',
    article_abstract: null,
  };

  generateNewsCard(
    data.article_title,
    data.summary[0],
    data.article_image,
    "source.com"
  );
}

//generating card
function generateNewsCard(headline, body, imageUrl, source) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  // Draw the image
  const img = new Image();
  img.src = imageUrl || "popcorn.png";
  img.onload = () => {
    ctx.drawImage(img, 0, 0, 1080, 1080);

    // Draw text background
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 700, 1080, 380);

    // Add headline
    ctx.font = "700 32px sans-serif";
    ctx.fillStyle = "#FFA500";
    ctx.stroke = 2;
    const headlineX = 50;
    const headlineY = 750;
    const headlineMaxWidth = 980;
    wrapText(ctx, headline, headlineX, headlineY, headlineMaxWidth, 50);
    ctx.fillStyle = "white";
    // Add body text
    ctx.font = "24px sans-serif";
    const bodyX = 50;
    const bodyY = 800;
    const bodyMaxWidth = 980;
    wrapText(ctx, body, bodyX, bodyY, bodyMaxWidth, 40);

    // Add source
    ctx.fillStyle = "#1E90FF";
    ctx.font = "italic 20px sans-serif";

    ctx.fillText(`Source: ${source}`, canvas.width / 2, canvas.height - bodyX);

    // Download card
    const link = document.createElement("a");
    link.download = "news-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    generateCardButton.innerText = "Generate News Card";
  };
}

generateCardButton.addEventListener("click", () => {
  generateCardButton.innerText = "Generating...";
  fetchSummary();
});
