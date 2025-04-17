try
  {
    const keychain = new KeychainSDK(window);
    
    const formParamsAsObject = {
     "data": {
          "username": "eddiespino",
          "witness": "aliento",
          "vote": true
     }
}
    
    const witnessvote = await keychain
         .witnessVote(
              formParamsAsObject.data);
    console.log({ witnessvote });
  } catch (error) {
    console.log({ error });
  }
