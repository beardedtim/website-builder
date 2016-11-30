import {expect} from 'chai'
import {Reader} from '../index.babel'

describe('Reader',()=>{
  it('should exist',()=>{
    expect(Reader).to.exist
  })
  
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