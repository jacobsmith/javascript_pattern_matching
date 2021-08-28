const JPM = {
  integer: (n) => Number.isInteger(n)  && !JPM.number(n),
  number: (n) => !isNaN(n),
}

function args_match(args, match) {
  if (match == JPM.integer) {
    return JPM.integer(args)
  } else if (match == JPM.number) {
    return JPM.number(args)
  }

  return args == match
}

function jpm({ match, func }) {
  return (args) => {
    if (args_match(args, match)) {
      func(args);
    }
  }
}

let functionProxyHandler = {
  set: (obj, prop, value) => {
    obj.functions = obj.functions || {};
    obj.functions[prop] = obj.functions[prop] || [];
    obj.functions[prop].push(value);
  },
  get: (obj, prop, value) => {
    return (args) => { 
      for (let i = 0; i < obj.functions[prop].length; i++) {
        fn = obj.functions[prop][i]
        val = fn(args)
        if (val) {
          return val
        }
      }
    }
  }
}

let func = new Proxy({}, functionProxyHandler)
func.call = jpm({ match: 'obj' , func: () => {
  console.log('you matched object!')
}});

func.num = jpm({ match: JPM.integer , func: (int) => {
  console.log('you passed the integer: ', int);
}})

func.num = jpm({ match: JPM.number , func: (int) => {
  console.log('you passed the number: ', int);
}})

func.call('obj')
func.call('not_obj')
func.num(12);
func.num(14);
func.num(12.04);
