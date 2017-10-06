const _ = require('lodash');
const dict = require('./dict');

module.exports = new class Resume {

  async process(content) {
    let data = {raw: content};
    let rows = this.cleanRows(content);

    for (let k in dict) {
      let v = dict[k];
      let func = this[`process${_.capitalize(k)}`];
      if (func) {
        data[k] = await func(content, rows, v);
      }
    }

    if (data.contact) {
      data.id = data.contact.email || (data.contact.name + (data.contact.phone || ''));
    }

    return data;
  }

  cleanRows(content) {
    return content.split('\n')
      .map(d => _.trim(d.replace(/\r?\n|\r|\t|\n/g, '        ')))
      .filter(d => !!d);
  }

  processContact(data, rows, options) {
    let ret = {};
    _.forOwn(options, (v, k) => {
      if (_.isArray(v)) {
        // array of regexps
        v.forEach(r => {
          if (_.isRegExp(r)) {
            let find = r.exec(data);
            if (find) {
              ret[k] = find[0];
            }
          }
        });
      }
    });
    return ret;
  }

  processDetail(data, rows, options) {
    let allTitles = _.flatten(_.toArray(options)).join('|');

    let ret = {};
    _.forEach(rows, (row, i) => {
      // typically, title will not have more than 5 words
      if (row && row.split(' ').length <= 5) {
        let restContent = _.slice(rows, i).join('\n') + '\n';
        // check all expressions
        _.forOwn(options, (expressions, key) => {
          expressions = expressions || [];
          // if already matched, then ignore
          if (ret[key]) return;

          _.forEach(expressions, (expression) => {
            let ruleExpression = new RegExp(expression, 'gmi');
            let isRuleFound = ruleExpression.test(row);

            if (isRuleFound) {
              let checkTitles = _.without(allTitles.split('|'), key).join('|');
              let searchExpression = '(?:' + expression + ')((.*\\n)+?)(?:'+checkTitles+'|page\\s\\d|$)';
              // restore remaining text to search in relevant part of text
              let result = new RegExp(searchExpression, 'igm').exec(restContent);

              if (result) {
                ret[key] = result[1];
              }
            }
          });
        });
      }
    });

    return ret;
  }

};
