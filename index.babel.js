
/**
 * Defining our types of data
 */ 

/**
 * An HTML Props object
 * @typedef {Object} prop     the key/value pair of an HTML prop
 * @param {string} name       the name of the prop
 * @param {string} value      the value to be encompassed with "${value}" 
 */ 


/**
 * A HTML Node 
 * @typedef {Object} Node                the node that will be built into HTML
 * @property {!string} type               the type of HTML tag this node is
 * @property {?Node[]} children           the children of this tag
 * @property {?prop[]} props    the props to add to the node
 * @property {?string} text     the inner text of the node
 */ 


 /**
  * flattenProps - Creates opening HTML tag with props
  * 
  * @param {string} type           the HTML tag to make
  * @param {prop[]} props          the props to attach
  * @param {!string} props[].name   the name of the prop to add
  * @param {!string} props[].value  the value of the prop to add
  * @return {string} str           the final opening tag w props
  */ 
 const flattenProps = (type,props) => {
   let str = `<${type} `
   for(let i = 0; i < props.length; i++){
     const {name,value} = props[i]
     str += `${name}="${value}" `
   }
   str += '>'
   return str
 }


 /**
  * flattenChildren - Creates HTML for children
  * 
  * TODO: make so where children can be added to specific spots
  *        
  *       Example: {
  *          type: 'p',
  *          text: 'this will $1 surrounded by text',
  *          children: [
  *              {
  *                type: 'span',
  *                text: 'be a span tag'
  *              }
  *            ]
  *        }
  *        ===
  *        <p>This will <span>be a span tag</span> surrounded by text</p>
  * 
  * @param {Node[]} children   the children to flatten
  * @return {string} str       the final version of the nested children
  * 
  */   
 const flattenChildren = (children) => {
     let str = ''
     for(let i = 0; i < children.length; i++){
       str += Reader.toHTML(children[i])
     }
     return str
 }


/**
 * The main object we export
 * 
 * @property {function} toHTML     exports Node to HTML
 */ 
export const Reader = {
  
  /**  
   * toHTML - Takes in a node and returns a string that looks like HTML
   * 
   * (Node) => String
   * 
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
  flattenProps,
  flattenChildren
}
