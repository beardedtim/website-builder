
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
  
  export const getTagGroup = (str) => {
    const group = /(<(.*?)>)(.*)(<\/(.*?)>)/,
          groups = group.exec(str)
    if(!groups){
      return {
        type: 'text',
        text: str
      }
    }
    return {
      type: getTypeFromMaybeWithProps(groups[2]),
      text: groups[3],
      props: getPropsFromTag(groups[1])
    }
  }
  
  export const getPropsFromTag = (tag) =>{
    const maybeWithoutProps = /<(.+?)>/
    if(maybeWithoutProps.exec(tag)){
      const fullTag = maybeWithoutProps.exec(tag)[1].split(' ').reduce((nodes,str)=>{
        if(str.indexOf('=') < 0){
          return nodes
        }else{
          const split = str.split('=')
          return [
            ...nodes,
            {
              name: split[0],
              value: split[1].slice(1,-1)
            }
          ]
        }
      },[])
      return fullTag
    }else {
      return []
    }
    
  }
  
  
  /**  
   * Given our structured HTML tag, returns the tag name
   * 
   * This is naively done. Assumes that anything with = has a tag in it
   * 
   * @param {string} str    the string that might have props 
   * @return {string}       the type / HTML tag name    
   */   
  export const getTypeFromMaybeWithProps = (str) => {
    if(str.indexOf('=') < 0){
      return str
    }else {
      return str.split(' ')[0]
    }
  }
  
  export const getElementsFromString = (str) => {
    if(typeof str !== 'string'){
      throw new TypeError(`getElementString expects str to be typeof string.`)
    }
    const isOpeningTag = /<([^/].*?)>/,
          isClosingTag = /<\/(.*?)>/,
          openingTagGroup = isOpeningTag.exec(str),
          closingTagGroup = isClosingTag.exec(str),
          node = {}
    
    /**
     * If we have an opening tag inside of this
     */      
    if(openingTagGroup){
      // Let's find out if we have any props
      node.props = getPropsFromTag(openingTagGroup[0])
      // And we need to find the tag
      node.type = getTypeFromMaybeWithProps(openingTagGroup[1])
      // If we have a closing tag group in this structure
      if(closingTagGroup){
        // Let's find out if we have any more opening tags
        const withoutOpeningTag = str.replace(openingTagGroup[0],''),
              // this will return null if there is no opening tag
              nestedOpeningTagGroup = isOpeningTag.exec(withoutOpeningTag)
        // If we did not find a nestedOpeningTagGroup      
        if(!nestedOpeningTagGroup){
          // we can assume that this has no children and instead
          // just is a text node
          node.text = withoutOpeningTag.replace(closingTagGroup[0],'')
        }else {
          // We assume that we have children inside of here
          // that we somehow need to find all the opening and closing
          // of these.
          node.children = []
        }
      }
    }
    
    
    return node
  }
  

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
  
  toJSON: (HTMLString) => {
    
  },
  getElementsFromString,
  flattenProps,
  flattenChildren,
  getTagGroup
}
