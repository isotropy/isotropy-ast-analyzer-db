function wait() {
  return { type: "wait" };
}


function error(message) {
  return { type: "error", message };
}


function result(data) {
  return { type: "result", result }
}

function skip() {
  return { type: "skip" }
}

export function traverse(schema, options = { result: v => v }) {
  return function*(obj, state, key) {

    obj = options.modifier ? options.modifier(obj) : obj;

    if (options.predicate && !options.predicate(obj)) {
      return skip();
    }

    let generators = [];

    for (const key in schema) {
      const lhs = obj[key];
      const rhs = schema[key];

      if (["string", "number", "boolean"].includes(typeof rhs)) {
        if (lhs !== rhs) {
          return error(`Expected ${rhs} but got ${lhs}.`);
        }
      }

      else if (Array.isArray(rhs)) {
        if (!Array.isArray(lhs)) {
          return error(`Expected array but got ${typeof lhs}.`)
        }
        if (rhs.length !== lhs.length) {
          return error(`Expected array of length ${rhs.length} but got ${lhs.length}.`)
        }

        generators = generators.concat(rhs.map(item => traverse(item, options)(lhs, state, key)))
      }

      else if (typeof rhs === "object") {
        generators = generators.concat(traverse(rhs, { ...options })(lhs, state, key));
      }

      else if (typeof rhs === "function") {
        generators = generators.concat(rhs(lhs, { parent: state }, key));
      }
    }

    while (true) {
      const results = generators.map(gen => [gen, gen.next()]);
      const finished = results.filter(r => r[1].done).map(r => r[1].value);

      generators = results.filter(r => r[1].done).map(r => r[0]);

      const result = finished.reduce((acc, item) => ({ ...acc, ...item }), state);

      if (result.type === "error") {
        return error(result.message)
      }
      else if (result.type === "skip") {
        return skip();
      }
      else if (result.type === "result") {
        state = { ...state, ...newState.result };
      }


      if (
        generators.length
        || (options.preconditions && options.preconditions.length && !options.preconditions.every(expr => expr()))
      ) {
        yield
      }

      else {
        if (options.asserts) {
          for (const assert of options.asserts) {
            if (assert[0]()) {
              return error(assert[1]);
            }
          }
        }
        return result(options.result(state, obj));
      }
    }
  }
}

export function capture(name, schema, options) {
  return traverse(
    schema || {},
    {
      result: (state, obj) => ({ [name]: obj })
    }
  )
}

export function captureIf(predicate, name, schema) {
  return traverse(
    schema || {},
    {
      predicate,
      result: (state, obj) => ({ [name]: obj })
    }
  )
}
