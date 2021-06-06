const p = Promise.reject(new Error("Reason for rejection..."));
p.catch((error) => console.log(error));
