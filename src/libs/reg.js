
//通用验证抽象
export const Rules = (type) => {
    let rules = {
        /**
         * 整数和零
         * hasZero  bool 是否包括0
         * 实例： $rules('isInt')(true),
         */
        isInt: (hasZero = false) => {
            return (rule, value, callback) => {
                let reg, errMsg;
                if (hasZero) {
                    reg = /^[0-9]\d*$/
                    errMsg = '请输入0或正整数'
                } else {
                    reg = /^[1-9]\d*$/;
                    errMsg = '请输入正整数'
                }
                if (value && !reg.test(value)) {
                    callback(new Error(errMsg));
                } else {
                    callback()
                }
            }
        },
        //手机
        mobile: (rule, value, callback) => {
            if (value && !/^1[3|4|5|7|8]\d{9}$/.test(value)) {
                callback(value + '不是合法的手机号码');
            } else {
                callback()
            }
        }
    };
    return rules[type]
};


