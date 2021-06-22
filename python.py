# import numpy as np
# import pandas_datareader as pdr
# import datetime as dt
# import pandas as pd

# tickers = ['AAPL', 'MSFT', 'TWTR', 'IBM']
# start = dt.datetime(2020, 1, 1)

# data = pdr.get_data_yahoo(tickers, start)
# data = data['Adj Close']
# log_returns = np.log(data/data.shift())
# # Monte Carlo Simulation
# n = 5000

# weights = np.zeros((n, 4))
# exp_rtns = np.zeros(n)

# exp_vols = np.zeros(n)

# sharpe_ratios = np.zeros(n)


# for i in range(n):
#     weight = np.random.random(4)
#     weight /= weight.sum()
#     weights[i] = weight
    
#     exp_rtns[i] = np.sum(log_returns.mean()*weight)*252
#     exp_vols[i] = np.sqrt(np.dot(weight.T, np.dot(log_returns.cov()*252, weight)))
#     sharpe_ratios[i] = exp_rtns[i] / exp_vols[i]

# print(sharpe_ratios.max())
# print(sharpe_ratios.argmax())
# print(weights[3153])

import sys

# if _name_ == "__main__":
#     st = sys.argv[1]
#     print(st + 'from python')
import numpy as np
import pandas_datareader as pdr
import datetime as dt
import pandas as pd

tickers = sys.argv[1:]
start = dt.datetime(2020, 1, 1)

data = pdr.get_data_yahoo(tickers, start)
data = data['Adj Close']
log_returns = np.log(data/data.shift())
# Monte Carlo Simulation
n = 5000

val=len(tickers)
weights = np.zeros((n, val))
exp_rtns = np.zeros(n)
exp_vols = np.zeros(n)
sharpe_ratios = np.zeros(n)

for i in range(n):
    weight = np.random.random(val)
    weight /= weight.sum()
    weights[i] = weight

exp_rtns[i] = np.sum(log_returns.mean()*weight)*252
exp_vols[i] = np.sqrt(np.dot(weight.T, np.dot(log_returns.cov()*252, weight)))
sharpe_ratios[i] = exp_rtns[i] / exp_vols[i]

for items in weights[sharpe_ratios.argmax()]:
    print(items)
