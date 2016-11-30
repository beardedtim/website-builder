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
      expect(html).to.equal('<p class="testingClass" id="testingID" data-id="1234" >This is text</p>')
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
      expect(nestedHTML).to.equal('<div id="app" data-id="1234" ><p class="error" data-err-id="321" >This is text</p></div>')
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
      expect(flattenedProps).to.equal('<div class="awesomeClass" >')
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
      expect(flat).to.equal('<div class="awesomeClass" >')
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
      expect(flat).to.equal('<div id="awesomeID" >')
    })
  })
  
  describe('Reader.getElementsFromString',()=>{
    it('exists',()=>{
      expect(Reader.getElementsFromString).to.exist
    })
    
    it('only takes in a string',()=>{
      const str = 'hello world',
            notStrs = [false,null,undefined,{},[],1]
      notStrs.forEach(notStr => {
        expect(()=>{Reader.getElementsFromString(notStr)}).to.throw('getElementString expects str to be typeof string.')
      })
      expect(()=>{Reader.getElementsFromString(str)}).to.not.throw('getElementString expects str to be typeof string.')
    })
    
    
    it('returns an object',()=>{
      const str = 'hello',
            parsed = Reader.getElementsFromString(str)
      expect(parsed.toString()).to.equal("[object Object]")
    })
    
    it('returns a tree of nodes from string',()=>{
      const str = '<p>Hello world!</p>',
            parsed = Reader.getElementsFromString(str),
            node = {
              type: 'p',
              text:'Hello world!',
              props: []
            }
      expect(parsed).to.deep.equal(node)
      
      
      const div = '<div>Hello from div!</div>',
            divNode = {
              type: 'div',
              props: [],
              text: 'Hello from div!'
            },
            divParsed = Reader.getElementsFromString(div)
      expect(divParsed).to.deep.equal(divNode)
    })
    
    it('returns a tree of nodes with props',()=>{
      const str = '<p class="timi">Hello world!</p>',
            node = {
              type: 'p',
              text: 'Hello world!',
              props: [
                {
                  name: 'class',
                  value: 'timi'
                }
              ]
            },
            parsed = Reader.getElementsFromString(str)
      expect(parsed).to.deep.equal(node)
    })
    
    
    
  })

})