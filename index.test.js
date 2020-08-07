import { fireEvent, getByText } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let dom;
let container;

describe('calculator functionality', () => {
  beforeEach(() => {
    // Constructing a new JSDOM with this option is the key
    // to getting the code in the script tag to execute.
    // This is indeed dangerous and should only be done with trusted content.
    // https://github.com/jsdom/jsdom#executing-scripts
    dom = new JSDOM(html, { runScripts: 'dangerously' });
    container = dom.window.document.body;
  })

  test('has an add button', () => {
    let node = getByText(container, '+');
    expect(node).toBeInTheDocument;
    expect(node).toHaveClass('btn');
    expect(node.nodeName.toLowerCase()).toBe('button');
  })

  test('has a subtract button', () => {
    let node = getByText(container, '-');
    expect(node).toBeInTheDocument;
    expect(node).toHaveClass('btn');
    expect(node.nodeName.toLowerCase()).toBe('button');
  })

  test('has a multiply button', () => {
    let node = getByText(container, '×');
    expect(node).toBeInTheDocument;
    expect(node).toHaveClass('btn');
    expect(node.nodeName.toLowerCase()).toBe('button');
  })

  test('has a divide button', () => {
    let node = getByText(container, '÷');
    expect(node).toBeInTheDocument;
    expect(node).toHaveClass('btn');
    expect(node.nodeName.toLowerCase()).toBe('button');
  })

  test('has a clear button', () => {
    let node = getByText(container, 'c');
    expect(node).toBeInTheDocument;
    expect(node).toHaveClass('btn');
    expect(node).toHaveClass('clear-button');
    expect(node.nodeName.toLowerCase()).toBe('button');
  })

  test('has the first input', () => {
    let node = container.querySelector('#input1');
    expect(node).toBeInTheDocument;
    expect(node.nodeName.toLowerCase()).toBe('input');
  })

  test('has the second input', () => {
    let node = container.querySelector('#input2');
    expect(node).toBeInTheDocument;
    expect(node.nodeName.toLowerCase()).toBe('input');
  })

  test('has a place for output', () => {
    let node = container.querySelector('#output');
    expect(node).toBeInTheDocument;
    expect(node.nodeName.toLowerCase()).toBe('div');
  })

  test('can add two numbers', () => {
    let input1 = container.querySelector("#input1");
    let input2 = container.querySelector("#input2");

    fireEvent.change(input1, {target: { value: 8 } });
    fireEvent.change(input2, {target: { value: 4 } });

    const button = getByText(container, '+');
    fireEvent.click(button);

    let result = container.querySelector("#output");
    expect(parseFloat(result.innerHTML)).toBe(12);
  })

  test('can subtract two numbers', () => {
    let input1 = container.querySelector("#input1");
    let input2 = container.querySelector("#input2");

    fireEvent.change(input1, {target: { value: 8 } });
    fireEvent.change(input2, {target: { value: 4 } });

    const button = getByText(container, '-');
    fireEvent.click(button);

    let result = container.querySelector("#output");
    expect(parseFloat(result.innerHTML)).toBe(4);
  })

  test('can multiply two numbers', () => {
    let input1 = container.querySelector("#input1");
    let input2 = container.querySelector("#input2");

    fireEvent.change(input1, {target: { value: 8 } });
    fireEvent.change(input2, {target: { value: 4 } });

    const button = getByText(container, '×');
    fireEvent.click(button);

    let result = container.querySelector("#output");
    expect(parseFloat(result.innerHTML)).toBe(32);
  })

  test('can divide two numbers', () => {
    let input1 = container.querySelector("#input1");
    let input2 = container.querySelector("#input2");

    fireEvent.change(input1, {target: { value: 8 } });
    fireEvent.change(input2, {target: { value: 4 } });

    const button = getByText(container, '÷');
    fireEvent.click(button);

    let result = container.querySelector("#output");
    expect(parseFloat(result.innerHTML)).toBe(2);
  })

  test('prints error if first input has no value', () => {
    let input1 = container.querySelector("#input1");
    let input2 = container.querySelector("#input2");

    fireEvent.change(input1, {target: { value: null } }); //so test doesn't fail in case of hard-coded value in HTML
    fireEvent.change(input2, {target: { value: 4 } });

    const button = getByText(container, '+');
    fireEvent.click(button);

    let result = container.querySelector("#output");
    expect(result.innerHTML.toLowerCase()).toBe('error');
  })

  test('prints error if second input has no value', () => {
    let input1 = container.querySelector("#input1");
    let input2 = container.querySelector("#input2");
    
    fireEvent.change(input1, {target: { value: 4 } });
    fireEvent.change(input2, {target: { value: null } }); //so test doesn't fail in case of hard-coded value in HTML

    const button = getByText(container, '+');
    fireEvent.click(button);

    let result = container.querySelector("#output");
    expect(result.innerHTML.toLowerCase()).toBe('error');
  })

  test('can clear inputs', () => {
    let input1 = container.querySelector("#input1");
    let input2 = container.querySelector("#input2");

    fireEvent.change(input1, {target: { value: 8 } });
    fireEvent.change(input2, {target: { value: 4 } });

    expect(input1.value).not.toBeNull;
    expect(input2.value).not.toBeNull;

    const clearButton = getByText(container, 'c');
    fireEvent.click(clearButton);

    expect(input1.value).toBeNull;
    expect(input2.value).toBeNull;
  })

  test('can clear output', () => {
    let output = container.querySelector("#output");
    output.innerHTML = '100';

    expect(output.innerHTML).not.toBeNull;

    const clearButton = getByText(container, 'c');
    fireEvent.click(clearButton);

    expect(output.innerHTML).toBeNull;
  })

})