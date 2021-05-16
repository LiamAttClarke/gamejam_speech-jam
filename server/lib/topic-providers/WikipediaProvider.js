const axios = require('axios');

module.exports = class WikipediaProvider {
  async provide() {
    const { data } = await axios.get('https://en.wikipedia.org/api/rest_v1/page/random/summary');
    return data.extract;
  }
}
