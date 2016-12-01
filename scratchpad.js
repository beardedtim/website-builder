import Utils from './src/utils'
import {Reader} from './index.babel'

const str = '<div id="app"><p class="para">This is a string with some <span data-id="number">span text</span> inside of it</p><p>This is a <span>Double Nested</span> stuff!</p></div>'

const group = Utils.getGroup(str)

const root =  {
  type: Utils.tagName(group),
  props: Utils.getProps(group),
  left: Utils.innerText(group),
  // innerGroup: Utils.getGroup(Utils.innerText(group))
}

// console.log(root)
// 



const tree = Reader.toJSON(str)
console.log(JSON.stringify(tree,null,2))
const built = Reader.toHTML(tree)
console.log(built)
console.log(str)



 




