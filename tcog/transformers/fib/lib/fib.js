const fib = {
    * [Symbol.iterator]() {
        let pre = 0,
            cur = 1;
        for (;;) {
            yield cur;
            [pre, cur] = [cur, pre + cur];
        }
    }
};

module.exports = fib;
