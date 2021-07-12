const express = require('express');
const app = express();
const fs = require('fs');
const port = process.env.port || 3001;
const cors = require('cors');
let { PythonShell } = require('python-shell');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});

app.get('/', (req, res) => {
  console.log('dummy');
});

// for adding new data
app.post('/add', (req, res) => {
  console.log(req.body);
  const present = fs.readFileSync('./data/stocks.json');
  const presentData = JSON.parse(present);
  const stocksData = presentData.stockData;
  let flag = 0;
  stocksData.map((ele) => {
    if (ele.id === req.body.id) {
      flag = 1;
      const prev = ele.addItem;
      const neww = [...prev, req.body.addItem];
      ele.addItem = neww;
      fs.writeFile(
        './data/stocks.json',
        JSON.stringify(
          {
            stockData: stocksData,
          },
          null,
          2
        ),
        () => {
          console.log('Added');
          const present = fs.readFileSync('./data/stocks.json');
          const presentData = JSON.parse(present);
          const stocksData = presentData.stockData;

          stocksData.map((stocks) => {
            if (stocks.id === req.body.id) {
              res.send(stocks.addItem);
            }
          });
        }
      );
    }
  });
  if (flag === 1) {
    return;
  }
  console.log('Im still in addItems');
  const newData = {
    id: req.body.id,
    addItem: [req.body.addItem],
  };
  const newArray = [...stocksData, newData];
  fs.writeFile(
    './data/stocks.json',
    JSON.stringify(
      {
        stockData: newArray,
      },
      null,
      2
    ),
    () => {
      console.log('Added');
      const present = fs.readFileSync('./data/stocks.json');
      const presentData = JSON.parse(present);
      const stocksData = presentData.stockData;

      stocksData.map((stocks) => {
        if (stocks.id === req.body.id) {
          res.send(stocks.addItem);
        }
      });
    }
  );
});

// to get all the user data and display
app.get('/getstocks/:id', (req, res) => {
  const id = req.params.id;
  const present = fs.readFileSync('./data/stocks.json');
  const presentData = JSON.parse(present);
  const stocksData = presentData.stockData;
  let arr = [];
  stocksData.map((ele) => {
    if (ele.id === id) {
      arr = ele.addItem;
    }
  });
  res.send(arr);
});

// updating the stock values
app.get(
  '/updatestock/:id/:editvalue/:oldvalue/:editingQuant/:oldQuant',
  (req, res) => {
    const { id, editvalue, oldvalue, editingQuant, oldQuant } = req.params;
    const present = fs.readFileSync('./data/stocks.json');
    const presentData = JSON.parse(present);
    const stocksData = presentData.stockData;
    console.log(
      `new:${editvalue},${editingQuant}, old:${oldvalue},${oldQuant}`
    );
    stocksData.map((stocks) => {
      if (stocks.id === id) {
        stocks.addItem.map((stock, index) => {
          if (stock[0] === oldvalue && stock[1] === oldQuant) {
            stocks.addItem[index] = [editvalue, editingQuant];
            return;
          }
        });
        return;
      }
    });

    fs.writeFile(
      './data/stocks.json',
      JSON.stringify(
        {
          stockData: stocksData,
        },
        null,
        2
      ),
      () => {
        console.log('Updated');
        const present = fs.readFileSync('./data/stocks.json');
        const presentData = JSON.parse(present);
        const stocksData = presentData.stockData;

        stocksData.map((stocks) => {
          if (stocks.id === id) {
            res.send(stocks.addItem);
          }
        });
      }
    );
  }
);

app.delete('/delete/:id/:val/:quant', (req, res) => {
  const { id, val, quant } = req.params;
  const present = fs.readFileSync('./data/stocks.json');
  const presentData = JSON.parse(present);
  const stocksData = presentData.stockData;

  stocksData.map((stock) => {
    if (stock.id === id) {
      stock.addItem.map((items, index) => {
        if (items[0] === val && items[1] === quant) {
          console.log('deleting');
          stock.addItem.splice(index, 1);
          return;
        }
      });
      return;
    }
  });
  fs.writeFile(
    './data/stocks.json',
    JSON.stringify(
      {
        stockData: stocksData,
      },
      null,
      2
    ),
    () => {
      console.log('Deleted');
      const present = fs.readFileSync('./data/stocks.json');
      const presentData = JSON.parse(present);
      const stocksData = presentData.stockData;

      stocksData.map((stocks) => {
        if (stocks.id === id) {
          res.send(stocks.addItem);
        }
      });
    }
  );
});

app.get('/getsimdata/:id', (req, res) => {
  const id = req.params.id;
  let data = [];
  let tickers = [];
  let response = [];

  const present = fs.readFileSync('./data/stocks.json');
  const presentData = JSON.parse(present);
  const stocksData = presentData.stockData;

  stocksData.map((stocks) => {
    if (stocks.id === id) {
      data = stocks.addItem;

      return;
    }
  });

  data.forEach((item) => {
    tickers.push(item[0]);
  });

  tickers.forEach((item) => {
    response.push([[item]]);
  });

  let options = {
    mode: 'text',
    encoding: 'utf8',
    pythonOptions: ['-u'],
    scriptPath: './',
    args: tickers,
    pythonPath: './.venv/Scripts/python.exe',
  };

  PythonShell.run('python.py', options, function (err, results) {
    if (err) throw err;
    let finalResult = [];
    finalResult = results;
    console.log(finalResult.slice(1));
    finalResult = finalResult.slice(1);
    let i = 0;
    finalResult.forEach((ele) => {
      response[i].push([ele]);
      i++;
    });
    res.send(response);
  });
});
