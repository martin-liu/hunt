export default new class Util {
  highlight(text, terms, hi, wordNum = 60) {
    var teaser = text.toString()
        .match(new RegExp(`(.{0,${wordNum}})[-\\s,]+(${terms.join('|')})[\\s\\.,]+(.{0,${wordNum}})`, 'ig'), hi);
    if (teaser) teaser = teaser.map(function(item) {
      return item.trim();
    });

    if (teaser) teaser = teaser.join(' ... ')
      .replace(new RegExp('[-\\s,]+(' + terms.join('|') + ')[\\s\\.,]+', 'ig'), hi);

    return teaser;
  }

  processSearchQuery(query) {
    let quoted = /["']([^"']+?)['"]/gmi;
    let matchs = (query.match(quoted) || []).map(d => d.replace(/["']/g, ''));

    // remove quoted contents
    query = query.replace(quoted, '');

    let queries = query.split(' ').concat(matchs).filter(d => !!d).map(_.trim);

    return queries;
  }

  encodeHtmlEntities(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
      return '&#'+i.charCodeAt(0)+';';
    });
  }
};
