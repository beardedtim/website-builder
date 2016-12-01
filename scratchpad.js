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

const getGroupFor = regex => str => regex.exec(str)

const getOpenTag = getGroupFor(/(<(.*?)>)/)

const getCloseTag = getGroupFor(/(<\/(.*?)>)/)

const getGroup = getGroupFor(/(<(.*?)>)(.*)(<\/(.*?)>)/)

const getIndex = group => group.index

const pipe = (...fns) => val => fns.reduce((res,fn)=> fn.call(null,res),val)

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

const isTag = tag => 
    group => group[2] === tag
    
const getTagName = text => text.split(' ')[0]

const getProps = text => text.split(' ').reduce((props,curr)=>{
  if(curr.indexOf('=') < 0){
    return props
  }else {
    const split = curr.split('=')
    props.push({
      name: split[0],
      value: split[1].slice(1,-1)
    })
    return props
  }
},{})



const findPreviousOpeningTag = (str,tag,start,end) => {
  if(start === 0){
    return str
  }
  const slice = str.slice(start,end),
        maybeOpen = getOpenTag(slice)
  return maybeOpen && 
  getTagName(maybeOpen[2]).toLowerCase() ===  tag.toLowerCase() ? 
    maybeOpen : findPreviousOpeningTag(str,tag,start - 1, end)
}

const replaceAt = ({start,end,input,src}) => 
     src.slice(0,start) + input + src.slice(end)

const createSymbolAndDict = str => {
  let symbolized = str,
      isSame = false,
      dict = {}
  while(!isSame){
    const endTag = getCloseTag(symbolized)
    if(!endTag){
      break
    }
    const endTagName = getTagName(endTag[2]),
          endTagIndex = endTag.index,
          endIndex = endTag[0].length + endTagIndex
    const found = findPreviousOpeningTag(symbolized,endTagName,endTagIndex -1, endTagIndex)
    if(!Array.isArray(found)){
      break
    }
    const replace = {
      start: endTagIndex - found.input.length,
      end: endTagIndex + endTag[1].length,
      input: guid(),
      src: symbolized
    }
    dict[replace.input] = symbolized.slice(replace.start,endIndex)
    symbolized = replaceAt(replace)
  }
  return [symbolized,dict]
}

const hasSiblings = (dict,innerText) => {
  const keys = Object.keys(dict)
  return keys.some(key => {
    return innerText.indexOf(key) >= 0
  })
}

const splitSiblings = (dict,text) => {
  const siblings = [],
        keys = Object.keys(dict),
        firstKey = keys.find(key => text.indexOf(key) >= 0)
  if(!firstKey){
    return text
  }
  var another = text,
      count = 0
  while(true && count < 10){
    const key = keys.find(key => another.indexOf(key) >= 0)
    if(!key){
      break;
    }
    const firstValue = dict[key],
          firstGroup = Utils.getGroup(firstValue),
          node = {
            type: Utils.tagName(firstGroup),
            props: Utils.getProps(firstGroup),
            children: splitSiblings(dict,Utils.innerText(firstGroup))
          }
    another = another.replace(key,`__BEARDED_TIM_COUNT_${count}__`)      
    siblings.push(node)
    count++
  }
  return {
    text: another,
    children: siblings
  }
  
}

const createTree = str => {
  const [symbolized,dict] = createSymbolAndDict(str)
  const group = Utils.getGroup(symbolized)
  const node = {
    type: Utils.tagName(group),
    props: Utils.getProps(group)
  }
  const inner = Utils.innerText(group)
  if(hasSiblings(dict,inner)){
    node.children = splitSiblings(dict,inner)
  }
  return node
}



const tree = createTree(str)
const built = Reader.toHTML(tree)
console.log(built)
console.log(str)



 




