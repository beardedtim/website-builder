import {expect} from 'chai'
import {Reader} from '../index.babel'

describe('Reader',()=>{
  it('should exist',()=>{
    expect(Reader).to.exist
  })
  describe('Reader.toHTML',()=>{
    it('turns a simple object into HTML string',()=>{
      const node = {
        type: 'p',
        children: null,
        text: 'This is text'
      },
            html = Reader.toHTML(node)
      expect(html).to.equal('<p>This is text</p>')
    })
    
    it('turns a nested object into an HTML string',()=>{
      const node = {
        type: 'div',
        children: [
          {
            type: 'p',
            children: null,
            text: 'This is text'
          }
        ]},
            html = Reader.toHTML(node)
        expect(html).to.equal('<div><p>This is text</p></div>')
    })
    
    it('adds props to nodes',()=>{
      const node = {
        type: 'p',
        children: null,
        props: [
          {
            name: 'class',
            value: 'testingClass'
          },
          {
            name: 'id',
            value: 'testingID'
          },
          {
            name: 'data-id',
            value: '1234'
          }
        ],
        text: 'This is text'
      },
            html = Reader.toHTML(node)
      expect(html).to.equal('<p class="testingClass" id="testingID" data-id="1234">This is text</p>')
      
      const text = {
        type: 'text',
        text: 'Timi is cool'
      },
          textHTML = 'Timi is cool'
      expect(Reader.toHTML(text)).to.equal(textHTML)
    })
    
    it('adds props to nested nodes',()=>{
      const nestedProps = {
        type: 'div',
        props: [
          {
            name: 'id',
            value: 'app'
          },
          {
            name: 'data-id',
            value: '1234'
          }
        ],
        children: [
          {
            type: 'p',
            children: null,
            text: 'This is text',
            props: [
              {
                name: 'class',
                value: 'error'
              },
              {
                name: 'data-err-id',
                value: '321'
              }
            ]
          }
        ]
      },
          nestedHTML = Reader.toHTML(nestedProps)
      expect(nestedHTML).to.equal('<div id="app" data-id="1234"><p class="error" data-err-id="321">This is text</p></div>')
    })
  })
  describe('Reader.toJSON',()=>{
    it('should exist',()=>{
      expect(Reader.toJSON).to.exist
    })
    
    it('can split a string into nested nodes',()=>{
      
    })
  })
  
  describe('Reader.flattenProps',()=>{
    it('returns an opening HTML tag given a type with props attached',()=>{
      const type = 'div',
            props = [{
              name: 'class',
              value: 'awesomeClass'
            }],
            flattenedProps = Reader.flattenProps(type,props)
      expect(flattenedProps).to.equal('<div class="awesomeClass">')
    })
    
    it('skips props that do not have a `name` property',()=>{
      const type = 'div',
            props = [
              {
                name: 'class',
                value: 'awesomeClass'
              },
              {
                value: 'awesomeValue'
              }
            ],
            flat = Reader.flattenProps(type,props)
      expect(flat).to.equal('<div class="awesomeClass">')
    })
    
    it('skips props that do not have a `value` property',()=>{
      const type = 'div',
            props = [
              {
                name: 'class'
              },
              {
                name: 'id',
                value: 'awesomeID'
              }
            ],
            flat = Reader.flattenProps(type,props)
      expect(flat).to.equal('<div id="awesomeID">')
    })
  })

  
  describe('getSingleNodeGroup',()=>{
    it('exists',()=>{
      expect(Reader.getSingleNodeGroup).to.exist
    })
    
    it('returns a node with type and text',()=>{
      const str = '<p class="timi">Hello world</p>'
      expect(Reader.getSingleNodeGroup(str)).to.deep.equal({
        type: 'p',
        text: 'Hello world',
        props: [{
          name: 'class',
          value:'timi'
        }]
      })
      
      const div = '<div id="app">Hello world!</div>'
      expect(Reader.getSingleNodeGroup(div)).to.deep.equal({
        type: 'div',
        text: 'Hello world!',
        props: [{
          name: 'id',
          value: 'app'
        }]
      })
    })
    
    
    it('works when only a string is given ( no tags )',()=>{
      const str = 'Hello world'
      expect(Reader.getSingleNodeGroup(str)).to.deep.equal({
        type: 'text',
        text: 'Hello world'
      })
    })
    
  })
  
  
  describe('getTypeFromMaybeWithProps',()=>{
    it('exists',()=>{
      expect(Reader.getTypeFromMaybeWithProps).to.exist
    })
    
    it('returns the type from an html tag',()=>{
      const tag = '<div>',
            type = Reader.getTypeFromMaybeWithProps(tag)
      expect(type).to.equal('div')
    })
    
    it('can handle a tag with props',()=>{
      const tag = '<div id="app">',
            type = Reader.getTypeFromMaybeWithProps(tag)
      expect(type).to.equal('div')
    })
  })
  
  
  describe('getPropsFromTag',()=>{
    it('exists',()=>{
      expect(Reader.getPropsFromTag).to.exist
    })
    
    it('returns an array',()=>{
      const str = 'hello',
            props = Reader.getPropsFromTag(str)
      expect(props).to.deep.equal([])
    })
    
    it('returns an array of props attached to a tag',()=>{
      const tag = '<div id="app" class="demo">',
            props = [
              {
                name: 'id',
                value: 'app'
              },
              {
                name: 'class',
                value: 'demo'
              }
            ]
      expect(Reader.getPropsFromTag(tag)).to.deep.equal(props)
    })
  })

})