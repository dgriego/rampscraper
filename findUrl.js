const cheerio = require("cheerio")
const axios = require("axios")

const requestUrl = 'https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge'

/*
<code data-class="23*">
  <div data-tag="*93">
    <span data-id="*21*">
      <i class="char" value="VALID_CHARACTER"></i>
    </span>
  </div>
</code>
*/

async function buildUrl() {
  const { data } = await axios.get(requestUrl)
  const $ = cheerio.load(data)
  let url = ''

  $('code').filter((_, el) => el.attribs['data-class'].startsWith('23')).each((_, dataClass) => {
    const divDataTag = $(dataClass).find('div[data-tag]')
      .filter((_, el) => el.attribs['data-tag'] .endsWith('93'))[0]
    const spanDataId = $(divDataTag).find('span[data-id]')
      .filter((_, el) => el.attribs['data-id'].match(/.+21.+/g))
    const validCharacter = $(spanDataId).find('i.char[value]')[0]?.attribs?.value
    
    if (validCharacter) {
      url += validCharacter
    }
  })

  return url
}

buildUrl().then(data => {
  console.log(data)
})