import {expect} from 'chai'
import {
  getGroup,
  containsOuterTags,
  innerText,
  tagAndProps,
  tagName,
  getProps
} from '../src/utils'


describe('getGroup',()=>{
  it('returns an array of the group found',()=>{
    const str = '<div>hello world</div>',
          group = getGroup(str)
    expect(group[0]).to.equal(str)
    expect(group[1]).to.equal('<div>')
    expect(group[2]).to.equal('div')
    expect(group[3]).to.equal('hello world')
    expect(group[4]).to.equal('</div>')
    expect(group[5]).to.equal('div')
  })
  
  it('returns null if non-grouped string',()=>{
    const notHTML = 'hello world',
          group = getGroup(notHTML)
    expect(group).to.equal(null)
  })
})

describe('containsOuterTags',()=>{
  it('returns true if a string contains open and closed HTML tags',()=>{
    const str = 'no tags',
          htmlStr = '<div>with tags</div>',
          onlyOpen = '<p>no close'
    expect(containsOuterTags(str)).to.equal(false)
    expect(containsOuterTags(htmlStr)).to.equal(true)
    expect(containsOuterTags(onlyOpen)).to.equal(false)
  })
})

describe('innerText',()=>{
  it('returns the inner group returned by getGroup',()=>{
    const str = '<div>Hello world</div>',
          inner = innerText(getGroup(str))
    expect(inner).to.equal('Hello world')
  })
  
  it('returns the inner parts even if they contain HTML tags',()=>{
    const nested = '<div><p>Hello world</p></div>',
          inner = innerText(getGroup(nested))
    expect(inner).to.equal('<p>Hello world</p>')
  })
})

describe('tagAndProps',()=>{
  it('returns the tag name from a grouping made by getGroup',()=>{
    const str = '<div>hello world</div>',
          group = getGroup(str),
          tag = tagAndProps(group)
    expect(tag).to.equal('div')
  })
})

describe('tagName',()=>{
  it('returns a string',()=>{
    const str = '<div>Hello world</div>',
          group = getGroup(str),
          tag = tagName(group)
          
    expect(typeof tag).to.equal('string')
  })
  
  it('returns just the tag even if props are present',()=>{
    const str = '<div id="app">Hello world</div>',
          group = getGroup(str),
          tag = tagName(group)
    expect(tag).to.equal('div')
  })
})


describe('getProps',()=>{
  it('returns an array',()=>{
    const str = '<div id="app">Hello world</div>',
          group = getGroup(str),
          props = getProps(tagAndProps(group))
    expect(Array.isArray(props)).to.equal(true)
  })
  
  it('returns an empty array if no props are present',()=>{
    const str = '<div>Hello world</div>',
          group = getGroup(str),
          props = getProps(tagAndProps(group))
    expect(props.length).to.equal(0)
  })
  
  it('returns an array of props if props are present',()=>{
    const str = '<div id="app">Hello world</div>',
          group = getGroup(str),
          props = getProps(group)
    expect(props).to.deep.equal([
      {
        name: 'id',
        value:'app'
      }
    ])
  })
})