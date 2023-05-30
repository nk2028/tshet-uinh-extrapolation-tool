//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//                    1. Libraries                      //
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

/**
 * An implementation of a set that preserves the insertion order.
 * @class
 */
class OrderedSet {
  /**
   * Creates a new OrderedSet.
   * @constructor
   */
  constructor() {
    this.set = new Set();
    this.array = [];
  }

  /**
   * Adds an element to the set.
   * @param {*} value - The value to add.
   */
  add(value) {
    if (!this.has(value)) {
      this.set.add(value);
      this.array.push(value);
    }
  }

  /**
   * Removes an element from the set.
   * @param {*} value - The value to remove.
   * @returns {boolean} - Returns true if the value was successfully removed, false otherwise.
   */
  delete(value) {
    if (this.has(value)) {
      this.set.delete(value);
      this.array = this.array.filter((item) => item !== value);
      return true;
    }
    return false;
  }

  /**
   * Checks if the set contains a given value.
   * @param {*} value - The value to check.
   * @returns {boolean} - Returns true if the value is present, false otherwise.
   */
  has(value) {
    return this.set.has(value);
  }

  /**
   * Returns the number of elements in the set.
   * @returns {number} - The size of the set.
   */
  size() {
    return this.set.size;
  }

  /**
   * Returns an iterator that contains the values in insertion order.
   * @returns {Iterator} - An iterator object.
   */
  values() {
    return this.array[Symbol.iterator]();
  }
}

/**
 * JavaScript version of Python's defaultdict.
 * @class
 */
class DefaultDict {
  /**
   * Creates a new DefaultDict.
   * @constructor
   * @param {function} defaultFactory - A function that returns the default value for missing keys.
   */
  constructor(defaultFactory) {
    this.defaultFactory = defaultFactory;
    return new Proxy({}, this);
  }

  /**
   * The handler for the proxy object.
   * @param {Object} target - The target object.
   * @param {string} prop - The property being accessed.
   * @returns {*} - The value of the property or the default value.
   */
  get(target, prop) {
    if (!(prop in target)) {
      target[prop] = this.defaultFactory();
    }
    return target[prop];
  }
}

/**
 * Zips two iterables together, yielding pairs of corresponding elements.
 * @param {Iterable} iterable1 - The first iterable.
 * @param {Iterable} iterable2 - The second iterable.
 * @returns {Iterable} An iterable object containing pairs of corresponding elements.
 */
const zip = (iterable1, iterable2) => {
  const iterator1 = iterable1[Symbol.iterator]();
  const iterator2 = iterable2[Symbol.iterator]();

  return {
    *[Symbol.iterator]() {
      while (true) {
        const result1 = iterator1.next();
        const result2 = iterator2.next();

        if (result1.done || result2.done) {
          return;
        }

        yield [result1.value, result2.value];
      }
    },
  };
};

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//                    2. Functions                      //
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

const rawDictionaryInput = document.getElementById("rawDictionaryInput");
const rawTableSpecsInput = document.getElementById("rawTableSpecsInput");
const outputArea = document.getElementById("outputArea");

const parseRawDictionary = (rawDictionary) =>
  rawDictionary
    .replace(/\n+$/, "")
    .split("\n")
    .reduce((acc, line) => {
      const [字頭, 拼音, 備註] = line.split("\t");
      const 拼音_ = !備註 ? 拼音 : `${拼音}(${備註})`;
      acc[字頭].push(拼音_);
      return acc;
    }, new DefaultDict(() => []));

const parseRawTableSpecs = (rawTableSpecs) =>
  rawTableSpecs
    .replace(/\n+$/, "")
    .split("\n")
    .map((line) => {
      const [name, expression] = line.split("\t");
      return { name, expression };
    });

const buildTables = (dictionary, tableSpecs) => {
  const tables = [];

  for (const { name, expression, target } of tableSpecs) {
    const table = new DefaultDict(() => new OrderedSet());

    for (const 音韻地位 of Qieyun.資料.iter音韻地位()) {
      const { 母, 呼, 等, 重紐, 韻, 聲, 攝 } = 音韻地位; // eslint-disable-line no-unused-vars
      const lhs = eval(expression);
      table[lhs]; // initialise dictionary key

      for (const { 字頭, 解釋 } of Qieyun.資料.query音韻地位(音韻地位)) {
        for (const 拼音 of dictionary[字頭] || []) {
          const 字音 = `${字頭}${拼音}`;
          table[lhs].add(字音);
        }
      }
    }

    tables.push(table);
  }

  return tables;
};

const handleSubmit = () => {
  const dictionary = parseRawDictionary(rawDictionaryInput.value);
  const tableSpecs = parseRawTableSpecs(rawTableSpecsInput.value);
  const tables = buildTables(dictionary, tableSpecs);

  outputArea.innerHTML = ""; // clear output area

  for (const [{ name }, table_] of zip(tableSpecs, tables)) {
    const myDefaultDict = table_;
    const table = document.createElement("table");

    const tr = document.createElement("tr");
    table.appendChild(tr);
    const th = document.createElement("th");
    th.textContent = name;
    th.colSpan = 3;
    tr.appendChild(th);

    for (const [key, orderedSet] of Object.entries(myDefaultDict)) {
      const row = document.createElement("tr");

      const keyCell = document.createElement("td");
      keyCell.textContent = key;
      row.appendChild(keyCell);

      const valuesCell = document.createElement("td");
      valuesCell.textContent = Array.from(orderedSet.values()).join(", ");
      row.appendChild(valuesCell);

      table.appendChild(row);
    }

    outputArea.appendChild(table);
  }
};

const handleLoadSampleDict = async () => {
  const request = await fetch("sample-dict.txt");
  const response = await request.text();
  rawDictionaryInput.value = response;
};

rawDictionaryInput.addEventListener("input", () => {
  const content = rawDictionaryInput.value;
  localStorage.setItem("rawDictionaryInputContent", content);
});

window.addEventListener("DOMContentLoaded", () => {
  const storedContent = localStorage.getItem("rawDictionaryInputContent");
  if (storedContent) rawDictionaryInput.value = storedContent;
});

rawTableSpecsInput.addEventListener("input", () => {
  const content = rawTableSpecsInput.value;
  localStorage.setItem("rawTableSpecsInputContent", content);
});

window.addEventListener("DOMContentLoaded", () => {
  const storedContent = localStorage.getItem("rawTableSpecsInputContent");
  if (storedContent) rawTableSpecsInput.value = storedContent;
});
