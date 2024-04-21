

export class Helpers {
  static firstLetterUppercase(username: string) {
    const originalValue = username.toLowerCase();
    const firstCase = originalValue[0].toUpperCase();
    const finalValue  = `${firstCase}${originalValue.substring(1)}`;
    return finalValue;
  }

  static toLowerCase(email: string) {
    return email.toLowerCase();
  }

  static generateRandomNumbers(integerLength: number) {
    const characters = '0123456789';

    let result='';

    const characterLength= characters.length;

    for(let i=0;i<integerLength;i++) {
      result+= characters.charAt(Math.floor(Math.random() * characterLength));
    }

    return parseInt(result, 10);
  }

  static parseJSON(prop: string): any {
    try {
      return JSON.parse(prop);
    }catch(err) {
      return prop;
    }
  }
}

