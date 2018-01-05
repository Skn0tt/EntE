const rfc3696 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/;

export default (email: string) => rfc3696.test(email);
