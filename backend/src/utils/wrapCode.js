import fs from "fs";


export const wrapCode = (userCode, language, functionName) => {

    if (language.toLowerCase() === "javascript") {
        return [
            userCode,
            '',
            // 'const data = require("fs").readFileSync(0, "utf-8").trim().split("\\n");',
            '',
            'const args = data.map(line => {',
            '  try { return JSON.parse(line); } catch { return line; }',
            '});',
            '',
            `const result = ${functionName}(...args);`,
            '',
            'console.log(JSON.stringify(result));'
        ].join('\n');
    }


    // if (language.toLowerCase() === "javascript") {
    //     return [
    //         userCode,
    //         '',
    //         // ❌ removed fs require
    //         'const data = require("fs").readFileSync(0, "utf-8").trim().split("\\n");',
    //         '',
    //         'const args = data.map(line => {',
    //         '  try { return JSON.parse(line); } catch { return line; }',
    //         '});',
    //         '',
    //         `const result = ${functionName}(...args);`,
    //         '',
    //         'console.log(JSON.stringify(result));'
    //     ].join('\n');
    // }




//     if (language.toLowerCase() === "c++") {
//         return `#include <bits/stdc++.h>
// using namespace std;

// ${userCode}

// int main() {

//     string line1, line2;
//     getline(cin, line1);
//     getline(cin, line2);

//     vector<int> nums;
//     string num = "";

//     for(char c : line1) {

//         if(isdigit(c) || c == '-') {
//             num += c;
//         }
//         else {
//             if(!num.empty()) {
//                 nums.push_back(stoi(num));
//                 num = "";
//             }
//         }
//     }

//     if(!num.empty()) {
//         nums.push_back(stoi(num));
//     }

//     int target = stoi(line2);

//     vector<int> result = ${functionName}(nums, target);

//     cout << "[";

//     for(int i = 0; i < result.size(); i++) {

//         cout << result[i];

//         if(i != result.size() - 1) {
//             cout << ",";
//         }
//     }

//     cout << "]";

//     return 0;
// }`;
//     }
    if (language.toLowerCase() === "c++") {
        return `#include <bits/stdc++.h>
using namespace std;

${userCode}

int main() {

    string line1, line2;
    getline(cin, line1);
    getline(cin, line2);

    vector<int> nums;
    string num = "";

    for(char c : line1) {

        if(isdigit(c) || c == '-') {
            num += c;
        }
        else {
            if(!num.empty()) {
                nums.push_back(stoi(num));
                num = "";
            }
        }
    }

    if(!num.empty()) {
        nums.push_back(stoi(num));
    }

    int target = stoi(line2);

    vector<int> result = ${functionName}(nums, target);

    cout << "[";

    for(int i = 0; i < result.size(); i++) {

        cout << result[i];

        if(i != result.size() - 1) {
            cout << ",";
        }
    }

    cout << "]";

    return 0;
}`;
    }

//     if (language.toLowerCase() === "java") {
//         return `
// import java.util.*;

// public class Main {

// ${userCode}

// public static void main(String[] args) {
//     Scanner sc = new Scanner(System.in);

//     String input = sc.nextLine();
//     input = input.replaceAll("[\\\\[\\\\]\\\\s]", "");
//     String[] parts = input.split(",");

//     int[] nums = new int[parts.length];
//     for (int i = 0; i < parts.length; i++) {
//         nums[i] = Integer.parseInt(parts[i]);
//     }

//     int result = ${functionName}(nums);

//     System.out.println(result);
// }
// }
// `;
//     }

    if (language.toLowerCase() === "java") {
        return `
import java.util.*;

public class Main {

${userCode}

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        String line1 = sc.nextLine();
        int target = Integer.parseInt(sc.nextLine());
        
line1 = line1.replaceAll("[\\\\[\\\\]\\\\s]", "");

        String[] parts = line1.split(",");

        int[] nums = new int[parts.length];

        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }

        int[] result = ${functionName}(nums, target);

        System.out.print("[");

        for(int i = 0; i < result.length; i++) {

            System.out.print(result[i]);

            if(i != result.length - 1) {
                System.out.print(",");
            }
        }

        System.out.print("]");
    }
}
`;
    }
    return userCode

}