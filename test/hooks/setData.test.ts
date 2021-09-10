import assert from "assert";
import setData from "../../src/hooks/setData";

describe("hook - setData", function() {
  it("sets userId for single item", function() {
    const methodsByType = {
      "before": ["create", "update", "patch", "remove"],
      "after": ["find", "get", "create", "update", "patch", "remove"]
    };
    Object.keys(methodsByType).forEach(type => {
      methodsByType[type].forEach(method => {
        const context = {
          method,
          type,
          params: {
            user: {
              id: 1
            }
          }
        };

        const dataOrResult = (type === "before") ? "data" : "result";
        context[dataOrResult] = {};

        //@ts-ignore
        const result = setData("params.user.id", "userId")(context);
        assert.strictEqual(result[dataOrResult].userId, 1, `'${type}/${method}': ${dataOrResult} has 'userId:1'`);
      });
    });
  });

  it("overwrites userId for single item", function() {
    const methodsByType = {
      "before": ["create", "update", "patch", "remove"],
      "after": ["find", "get", "create", "update", "patch", "remove"]
    };
    Object.keys(methodsByType).forEach(type => {
      methodsByType[type].forEach(method => {
        const context = {
          method,
          type,
          params: {
            user: {
              id: 1
            }
          }
        };

        const dataOrResult = (type === "before") ? "data" : "result";
        context[dataOrResult] = { userId: 2 };

        //@ts-ignore
        const result = setData("params.user.id", "userId")(context);
        assert.strictEqual(result[dataOrResult].userId, 1, `'${type}/${method}': ${dataOrResult} has 'userId:1'`);
      });
    });
  });

  it("sets userId for multiple items", function() {
    const methodsByType = {
      "before": ["create", "update", "patch", "remove"],
      "after": ["find", "get", "create", "update", "patch", "remove"]
    };
    Object.keys(methodsByType).forEach(type => {
      methodsByType[type].forEach(method => {
        const context = {
          method,
          type,
          params: {
            user: {
              id: 1
            }
          },
        };

        const dataOrResult = (type === "before") ? "data" : "result";
        context[dataOrResult] = [{}, {}, {}];

        //@ts-ignore
        const result = setData("params.user.id", "userId")(context);
        result[dataOrResult].forEach(item => {
          assert.strictEqual(item.userId, 1, `'${type}/${method}': ${dataOrResult} has 'userId:1'`);
        });
      });
    });
  });

  it("overwrites userId for multiple items", function() {
    const methodsByType = {
      "before": ["create", "update", "patch", "remove"],
      "after": ["find", "get", "create", "update", "patch", "remove"]
    };
    Object.keys(methodsByType).forEach(type => {
      methodsByType[type].forEach(method => {
        const context = {
          method,
          type,
          params: {
            user: {
              id: 1
            }
          }
        };

        const dataOrResult = (type === "before") ? "data" : "result";
        context[dataOrResult] = [{ userId: 2 }, {}, { userId: "abc" }];

        //@ts-ignore
        const result = setData("params.user.id", "userId")(context);
        result[dataOrResult].forEach(item => {
          assert.strictEqual(item.userId, 1, `'${type}/${method}': ${dataOrResult} has 'userId:1'`);
        });
      });
    });
  });

  it("does not change createdById if 'params.user.id' is not provided", function() {
    const methodsByType = {
      "before": ["create", "update", "patch", "remove"],
      "after": ["find", "get", "create", "update", "patch", "remove"]
    };
    Object.keys(methodsByType).forEach(type => {
      methodsByType[type].forEach(method => {
        const context = {
          method,
          type,
          params: {}
        };

        const dataOrResult = (type === "before") ? "data" : "result";
        context[dataOrResult] = { userId: 2 };

        //@ts-ignore
        const result = setData("params.user.id", "userId")(context);

        assert.strictEqual(result[dataOrResult].userId, 2, `'${type}/${method}': ${dataOrResult} has 'userId:2'`);
      });
    });
  });

  it("throws if 'external' is set and context.user.id is undefined", function() {
    const methodsByType = {
      "before": ["create", "update", "patch", "remove"],
      "after": ["find", "get", "create", "update", "patch", "remove"]
    };
    Object.keys(methodsByType).forEach(type => {
      methodsByType[type].forEach(method => {
        const context = {
          method,
          type,
          params: {
            provider: "socket.io"
          }
        };

        const dataOrResult = (type === "before") ? "data" : "result";
        context[dataOrResult] = {};

        assert.throws(
          //@ts-ignore
          () => setData("params.user.id", "userId")(context),
          err => err.name === "Forbidden",
          `'${type}/${method}': throws 'Forbidden' error`
        );
      });
    });
  });

  it("passes if 'external' and 'allowUndefined: true'", function() {
    const methodsByType = {
      "before": ["create", "update", "patch", "remove"],
      "after": ["find", "get", "create", "update", "patch", "remove"]
    };
    Object.keys(methodsByType).forEach(type => {
      methodsByType[type].forEach(method => {
        const context = {
          method,
          type,
          provider: "socket.io",
          params: {},
          data: {}
        };

        assert.doesNotThrow(
          //@ts-ignore
          () => setData("params.user.id", "userId", { allowUndefined: true })(context),
          `'${type}/${method}': passes`
        );
      });
    });
  });

  describe("overwrite: false", function() {
    it("sets userId for single item", function() {
      const methodsByType = {
        "before": ["create", "update", "patch", "remove"],
        "after": ["find", "get", "create", "update", "patch", "remove"]
      };
      Object.keys(methodsByType).forEach(type => {
        methodsByType[type].forEach(method => {
          const context = {
            method,
            type,
            params: {
              user: {
                id: 1
              }
            }
          };
  
          const dataOrResult = (type === "before") ? "data" : "result";
          context[dataOrResult] = {};
  
          //@ts-ignore
          const result = setData("params.user.id", "userId", { overwrite: false })(context);
          assert.strictEqual(result[dataOrResult].userId, 1, `'${type}/${method}': ${dataOrResult} has 'userId:1'`);
        });
      });
    });

    it("does not overwrite userId for single item", function() {
      const methodsByType = {
        "before": ["create", "update", "patch", "remove"],
        "after": ["find", "get", "create", "update", "patch", "remove"]
      };
      Object.keys(methodsByType).forEach(type => {
        methodsByType[type].forEach(method => {
          const context = {
            method,
            type,
            params: {
              user: {
                id: 1
              }
            }
          };
  
          const dataOrResult = (type === "before") ? "data" : "result";
          context[dataOrResult] = { userId: 2 };
  
          //@ts-ignore
          const result = setData("params.user.id", "userId", { overwrite: false })(context);
          assert.strictEqual(result[dataOrResult].userId, 2, `'${type}/${method}': ${dataOrResult} has 'userId:2'`);
        });
      });
    });
  
    it("sets userId for multiple items", function() {
      const methodsByType = {
        "before": ["create", "update", "patch", "remove"],
        "after": ["find", "get", "create", "update", "patch", "remove"]
      };
      Object.keys(methodsByType).forEach(type => {
        methodsByType[type].forEach(method => {
          const context = {
            method,
            type,
            params: {
              user: {
                id: 1
              }
            },
          };
  
          const dataOrResult = (type === "before") ? "data" : "result";
          context[dataOrResult] = [{}, {}, {}];
  
          //@ts-ignore
          const result = setData("params.user.id", "userId", { overwrite: false })(context);
          result[dataOrResult].forEach((item) => {
            assert.strictEqual(item.userId, 1, `${type}/${method}': ${dataOrResult} has 'userId:1'`);
          });
        });
      });
    });
  
    it("overwrites userId for multiple items", function() {
      const methodsByType = {
        "before": ["create", "update", "patch", "remove"],
        "after": ["find", "get", "create", "update", "patch", "remove"]
      };
      Object.keys(methodsByType).forEach(type => {
        methodsByType[type].forEach(method => {
          const context = {
            method,
            type,
            params: {
              user: {
                id: 1
              }
            }
          };
  
          const dataOrResult = (type === "before") ? "data" : "result";
          context[dataOrResult] = [{ userId: 0 }, {}, { userId: 2 }];
  
          //@ts-ignore
          const result = setData("params.user.id", "userId", { overwrite: false })(context);
          result[dataOrResult].forEach((item, i) => {
            assert.strictEqual(item.userId, i, `${type}/${method}': ${dataOrResult} has 'userId:${i}`);
          });
        });
      });
    });
  });
});
