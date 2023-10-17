const parser = (RSS) => {
  const parserInstance = new DOMParser();
  const rssData = parserInstance.parseFromString(RSS, 'text/xml');

  const parseError = rssData.querySelector('parsererror');
  if (parseError) {
    const parseErrorText = parseError.textContent;
    const parseErrorOutput = new Error(`XML parsing error: ${parseErrorText}`);
    parseErrorOutput.isParsingError = true;
    throw parseErrorOutput;
  }

  const rssNode = rssData.querySelector('channel > title');
  const rssNodeTitle = rssNode ? rssNode.textContent.trim() : '';

  const rssDescription = rssData.querySelector('channel > description');
  const rssNodeDescription = rssDescription ? rssDescription.textContent.trim() : '';

  const rssItems = rssData.querySelectorAll('item');

  const posts = Array.from(rssItems).map((post) => ({
    title: post.querySelector('title').textContent.trim(),
    description: post.querySelector('description').textContent.trim(),
    link: post.querySelector('link').textContent.trim(),
  }));
  console.log({ rssNodeTitle, rssNodeDescription, posts });

  return { rssNodeTitle, rssNodeDescription, posts };
};

export default parser;
