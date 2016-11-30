
/**
 * Defining our types of data
 */ 

/**
 * An HTML Props object
 * @typedef {Object} prop     
 * @property {string} name       the name of the prop
 * @property {string} value      the value to be encompassed with "${value}" 
 */ 


/**
 * A HTML Node 
 * @typedef {Object} Node                
 * @property {!string} type               the type of HTML tag this node is
 * @property {?Node[]} children           the children of this tag
 * @property {?prop[]} props    the props to add to the node
 * @property {?string} text     the inner text of the node
 */ 

 /** 
  * A string of HTML
  * @typedef {string} HTMLString   a string that is valid HTML 
  */  

 /**
  * flattenProps - Creates opening HTML tag with props
  * 
  * (String, prop[]) => String
  * 
  * @type {function}
  * @param {string} type           the HTML tag to make
  * @param {prop[]} [props=[]]     the props to attach
  * @param {!string} props[].name  the name of the prop to add
  * @param {!string} props[].value the value of the prop to add
  * @return {string} str           the final opening tag w props
  */ 
 export const flattenProps = (type,props = []) => {
   let str = `<${type} `
   for(let i = 0; i < props.length; i++){
     const {name,value} = props[i]
     
     // If we do not have truthy values to use for name or value
     // let's skip this iteration
     if(!name || !value){
       continue;
     }
     
     str += `${name}="${value}" `
   }
   str += '>'
   return str
 }


 /**
  * flattenChildren - Creates HTML for children (Node[]) => String
  * 
  * @type {function} 
  * @param {Node[]} children   the children to flatten
  * @return {string} str       the final version of the nested children
  * 
  */   
 export const flattenChildren = (children) => {
     let str = ''
     for(let i = 0; i < children.length; i++){
       str += Reader.toHTML(children[i])
     }
     return str
 }
 
 
 
 /** 
  * List of tag names that do not need an ending. 
  * 
  * This also means that there cannot be children/text inside of these tags
  * 
  * @type {string[]}  List of self closing tags 
  */  
 export const SELF_CLOSING_TAGS = [
   'area',
   'base',
   'br',
   'col',
   'command',
   'embed',
   'hr',
   'img',
   'input',
   'keygen',
   'link',
   'meta',
   'param',
   'source',
   'track',
   'wbr'
 ]


/**
 * The main object we export
 * 
 * @property {function} toHTML          exports HTMLString from Node
 * @property {function} toJSON          exports Node from HTMLString 
 * @property {function} flattenProps    flattens props (type,props) => str
 * @property {function} flattenChildren flattens children (children) => str
 */ 
export const Reader = {
  
  /**  
   * toHTML - Takes in a node and returns a string that looks like HTML
   * 
   * (Node) => String
   * @memberof Reader
   * @alias toHTML
   * @param {Node} node           the node to turn into HTML
   * @return {string} HTMLString  the HTMl version of our Node    
   */   
  toHTML: (node) => {
    const {type,children,text,props = []} = node
    const beginning = props.length ? flattenProps(type,props) : `<${type}>`,
          ending = `</${type}>`
    if(!children && !text){
      return beginning + ending
    }
    
    if(!children){
      return beginning + text + ending
    }
    
    return beginning + flattenChildren(children) + ending
  },
  
  toJSON: (HTMLString) => {
    
  },
  
  flattenProps,
  flattenChildren
}
