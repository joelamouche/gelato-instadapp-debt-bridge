import { utils } from "ethers";

export function abiEncodeWithSelector(
  abi: any,
  functionName: string,
  inputs?: any[]
): Promise<any> {
  try {
    const interFace = new utils.Interface(abi);

    let functionFragment;
    try {
      functionFragment = interFace.getFunction(functionName);
    } catch (error) {
      throw new Error(
        `\n ❌ abi-encode-with-selector: functionName "${functionName}" not found`
      );
    }

    let payloadWithSelector;

    if (inputs) {
      let iterableInputs;
      try {
        iterableInputs = [...inputs];
      } catch (error) {
        iterableInputs = [inputs];
      }
      payloadWithSelector = interFace.encodeFunctionData(
        functionFragment,
        iterableInputs
      );
    } else {
      payloadWithSelector = interFace.encodeFunctionData(functionFragment, []);
    }

    return payloadWithSelector;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
