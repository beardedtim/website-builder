/**
 * Group returned by getGroup
 * 
 * @typedef {string[]|null}  Group
 * @property {string} 0      the original string searched
 * @property {string} 1      the full opening tag with < and >
 * @property {string} 2      the opening tag without the < or > | includes props
 * @property {string} 3      the inner text between the opening and closing tags
 * @property {string} 4      the full closing tag with </ and >
 * @property {string} 5      the closing tag without </ or >
 */ 

/**
 * Returns array found by regex
 * @param {string} str      the string to search
 * @return {Group|null}     either an array of the groups or null
 */ 
export const getGroup = str => /(<(.*?)>)(.*)(<\/(.*?)>)/.exec(str)



/**
 * Returns true/false if has tags
 * @param {string} str    the string to test
 * @return {bool}         if the string contains tags
 */ 
export const containsOuterTags = str => !!getGroup(str)



/**
 * Grabs the inner text from a group returned by getGroup
 * @param {Group} group     a grouping returned by getGroup
 * @return {string}         the inner text of the group
 */ 
export const innerText = group => group[3]



/**
 * Grabs the opening tag from a group returned by getGroup
 * @param {Group} group     a grouping returned by getGroup
 * @return {string}         the opening tag
 */ 
export const tagAndProps = group => group[2]



/**
 * Returns just the tag name from a possible tag and props string
 * 
 * @param {Group} group     the group returnd by getGroup
 * @return {string}         the tag name
 */ 
export const tagName = group => group[5]




/**
 * Returns just the props from a group
 * 
 * @param {Group} group      a group returned by getGroup
 * @return {Node[] | []}     an array of nodes of props
 */ 
export const getProps = (group) =>{
  const maybeWithoutProps = /<(.+?)>/,
        tag = group[1]
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

const Utils = {
  getGroup,
  containsOuterTags,
  innerText,
  tagAndProps,
  tagName,
  getProps,
}

export default Utils
