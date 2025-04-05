const fetch = require('node-fetch');
const fs = require('fs');

const scrape = async (query = 'lego') => {
  const url = `https://www.vinted.fr/api/v2/catalog/items?search_text=${encodeURIComponent(query)}&per_page=50`;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'fr-FR,fr;q=0.9',
    'Referer': `https://www.vinted.fr/catalog?search_text=${encodeURIComponent(query)}`,
    'Origin': 'https://www.vinted.fr',
    'Connection': 'keep-alive',
    'Cookie': "v_udt=dG4rUjF2Rko5Y0Qxay95S3BpOWVhaHcwZTc3cS0tWjEwOUl6TzNrdVd4L3RkZS0tRytvOVBiM0ZzYlFpRFYrcnozdERMZz09; anon_id=39b043fc-9491-45ff-b9e8-e633e971b422; anon_id=39b043fc-9491-45ff-b9e8-e633e971b422; OptanonAlertBoxClosed=2025-04-05T12:03:26.378Z; eupubconsent-v2=CQPY1_AQPY1_AAcABBENBkFsAP_gAAAAAChQJwtX_G__bXlj8T71aftkeY1f99h7rsQxBgbJk-4FyLvW_JwX32E7NAz6pqYKmRIAu3TBIQNlHIDURUCgaogVrSDMaEyUoTNKJ6BkiFMRY2cYCFxvm4lDeQCY5vr991c52R-t7dr83dzyy4hHv3a5_2S1WJCdAYctDfv8bROb-9IOd_x8v4v4_FgAAAAAABAAAAAAAAAAAAAAAAAAABYAAACwkEAABAAC4AKAAqABwADwAIIAZABqADwAJgAVQA3gB6AD8AISAQwBEgCOAEsAJoAVoAw4BlAGWANkAd8A9gD4gH2AfoBAACKQEXARiAjQCOAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHAAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB8gD9wICAQMggiCCYEGAIVgQuHALgAEQAOAA8AC4AJAAfgBoAHOAO4AgEBBwEIAJ-AVAAvQB0gEIAI9ASKAlYBMQCZQE2gKQAUmArsBagDEAGLAMhAZMA0YBpoDUwGvANoAbYA24Bx8DnQOfAfEA-2B-wH7gQPAgiBBgCDYEKx0EsABcAFAAVAA4ACAAF0AMgA1AB4AEwAKsAXABdADEAG8APQAfoBDAESAI4ASwAmgBRgCtAGGAMoAaIA2QB3gD2gH2AfsBFAEYAI4AUEAq4BYgC5gF5AMUAbQA3ABxADqAIdAReAkQBMgCdgFDgKPgU0BTYCrAFigLYAXAAuQBdoC7wF5gL6AYaAx4BkgDJwGVQMsAy4BnIDVQGsANvAbqA4sByYDlwHjgPaAfWBAECFpAAkAAgANAA5wCxAI9ATaApMBeQDUwG2ANuAc-A-IB-wEDwIMAQbAhWQgOAALAAoAC4AKoAXAAxABvAD0AO8AigBHACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEYACAAFgAUAA4ADwAJgAVQAuABigEMARIAjgBRgCtAGyAO8AfgBHACrgGKAOoAh0BF4CRAFHgKbAWKAtgBeYDJwGWAM5AawA28B7QEDyQA4AC4A7gCAAFQAR6AkUBKwCbQFJgMWAbkA_cCCIEGCkDYABcAFAAVAA4ACCAGQAaAA8ACYAFUAMQAfoBDAESAKMAVoAygBogDZAHfAPsA_QCLAEYAI4AUEAq4BcwC8gGKANoAbgBDoCLwEiAJ2AUOApsBYoC2AFwALkAXaAvMBfQDDQGSAMngZYBlwDOYGsAayA28BuoDkwHjgPaAhCBC0oAfAAuACQARwA5wB3AEAAJEAWIA14B2wD_gI9ASKAmIBNoCkAFPgK7AXkAxYBkwDUwGvAPigfsB-4EDAIHgQTAgwBBsCFZaACApsAA.f_wAAAAAAAAA; OTAdditionalConsentString=1~43.46.55.61.70.83.89.93.108.117.122.124.135.143.144.147.149.159.192.196.211.228.230.239.259.266.286.291.311.318.320.322.323.327.367.371.385.394.407.415.424.430.436.445.486.491.494.495.522.523.540.550.559.560.568.574.576.584.587.591.737.802.803.820.821.839.864.899.904.922.931.938.979.981.985.1003.1027.1031.1040.1046.1051.1053.1067.1092.1095.1097.1099.1107.1135.1143.1149.1152.1162.1166.1186.1188.1205.1215.1226.1227.1230.1252.1268.1270.1276.1284.1290.1301.1307.1312.1345.1356.1375.1403.1415.1416.1421.1423.1440.1449.1455.1495.1512.1516.1525.1540.1548.1555.1558.1570.1577.1579.1583.1584.1591.1603.1616.1638.1651.1653.1659.1667.1677.1678.1682.1697.1699.1703.1712.1716.1721.1725.1732.1745.1750.1765.1782.1786.1800.1810.1825.1827.1832.1838.1840.1842.1843.1845.1859.1866.1870.1878.1880.1889.1899.1917.1929.1942.1944.1962.1963.1964.1967.1968.1969.1978.1985.1987.2003.2008.2027.2035.2039.2047.2052.2056.2064.2068.2072.2074.2088.2090.2103.2107.2109.2115.2124.2130.2133.2135.2137.2140.2147.2156.2166.2177.2186.2205.2213.2216.2219.2220.2222.2225.2234.2253.2279.2282.2292.2309.2312.2316.2322.2325.2328.2331.2335.2336.2343.2354.2358.2359.2370.2376.2377.2387.2400.2403.2405.2407.2411.2414.2416.2418.2425.2440.2447.2461.2465.2468.2472.2477.2481.2484.2486.2488.2493.2498.2501.2510.2517.2526.2527.2532.2535.2542.2552.2563.2564.2567.2568.2569.2571.2572.2575.2577.2583.2584.2596.2604.2605.2608.2609.2610.2612.2614.2621.2628.2629.2633.2636.2642.2643.2645.2646.2650.2651.2652.2656.2657.2658.2660.2661.2669.2670.2677.2681.2684.2687.2690.2695.2698.2713.2714.2729.2739.2767.2768.2770.2772.2784.2787.2791.2792.2798.2801.2805.2812.2813.2816.2817.2821.2822.2827.2830.2831.2834.2838.2839.2844.2846.2849.2850.2852.2854.2860.2862.2863.2865.2867.2869.2873.2874.2875.2876.2878.2880.2881.2882.2883.2884.2886.2887.2888.2889.2891.2893.2894.2895.2897.2898.2900.2901.2908.2909.2916.2917.2918.2919.2920.2922.2923.2927.2929.2930.2931.2940.2941.2947.2949.2950.2956.2958.2961.2963.2964.2965.2966.2968.2973.2975.2979.2980.2981.2983.2985.2986.2987.2994.2995.2997.2999.3000.3002.3003.3005.3008.3009.3010.3012.3016.3017.3018.3019.3028.3034.3038.3043.3052.3053.3055.3058.3059.3063.3066.3068.3070.3073.3074.3075.3076.3077.3089.3090.3093.3094.3095.3097.3099.3100.3106.3109.3112.3117.3119.3126.3127.3128.3130.3135.3136.3145.3150.3151.3154.3155.3163.3167.3172.3173.3182.3183.3184.3185.3187.3188.3189.3190.3194.3196.3209.3210.3211.3214.3215.3217.3219.3222.3223.3225.3226.3227.3228.3230.3231.3234.3235.3236.3237.3238.3240.3244.3245.3250.3251.3253.3257.3260.3270.3272.3281.3288.3290.3292.3293.3296.3299.3300.3306.3307.3309.3314.3315.3316.3318.3324.3328.3330.3331.3531.3731.3831.4131.4531.4631.4731.4831.5231.6931.7235.7831.7931.8931.9731.10231.10631.10831.11031.11531.12831.13632.13731.14034.14237.14332.15731.16831.16931.21233.23031.25131.25731.25931.26031.26831.27731.27831.28031.28731.28831.29631.32531.33631.34231.34631.36831.39131.39531.40632.41531.43631.43731; _lm_id=18V5WTBWLGVDIN5G; _gcl_au=1.1.1291888823.1743854607; _ga=GA1.1.1413329123.1743854607; __podscribe_vinted_referrer=https://chatgpt.com/; __podscribe_vinted_landing_url=https://www.vinted.fr/; __podscribe_did=pscrb_7ff2059c-9abc-4b09-af77-e0aaee16cc48; _fbp=fb.1.1743854607051.459976373679891; domain_selected=true; anonymous-locale=fr; v_uid=263626377; v_sid=1fe37e8b-1743854672; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwic3ViIjoiMjYzNjI2Mzc3IiwiaWF0IjoxNzQzODU0NjcyLCJzaWQiOiIxZmUzN2U4Yi0xNzQzODU0NjcyIiwic2NvcGUiOiJwdWJsaWMgdXNlciIsImV4cCI6MTc0Mzg2MTg3MiwicHVycG9zZSI6ImFjY2VzcyIsImxvZ2luX3R5cGUiOjMsImFjdCI6eyJzdWIiOiIyNjM2MjYzNzcifSwiYWNjb3VudF9pZCI6MjA0NjAyODg3fQ.O2yNAaPCAOlZDVl7YsZHVdlT-FClsM41hwKOLxvlgruQSfrJvZ6ZC4TTABWmzUGlQmpkQCqfzd6-6bCZRgGi9suWxLZMerWfzrpPAG3N_uUrCv-qLC0I8vqN-lsBtZtFDiVCizK2UZzqrHAXimKMsSGKxRRMt72EY4E2NMUZ0wWT8ML0SBnz-QfW0Rk2o9loDmB0uKdKEBBNiN5N7fi9Olg660Pk_3vUC5Ia6McDTBsfdaqUmUH9DRUDx3IKZVLD7Hf0FV5YsGKLGmKdMMx_AAoRJfLiLii1UiLKC0LuzNjiX6dya2hjP5YuuUjXgM55mL32nR66thgvyPbfs4y7rw; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwic3ViIjoiMjYzNjI2Mzc3IiwiaWF0IjoxNzQzODU0NjcyLCJzaWQiOiIxZmUzN2U4Yi0xNzQzODU0NjcyIiwic2NvcGUiOiJwdWJsaWMgdXNlciIsImV4cCI6MTc0NDQ1OTQ3MiwicHVycG9zZSI6InJlZnJlc2giLCJsb2dpbl90eXBlIjozLCJhY3QiOnsic3ViIjoiMjYzNjI2Mzc3In0sImFjY291bnRfaWQiOjIwNDYwMjg4N30.f4ZZX7KqM19fle0N1WSUdJA_nTWe0Ml_v34unelGMCvgmFkv3BcGegu_RdJfx_4SRpCk-FRYnOzbwflmGGp31N-2Gnp-dovr-iLnPCyv45RzEEbyB0zu-4FhMTZeFkQN_J3DobBZQhYpwzJ5kJm6cN90hWxjxaqFR4B_SbnxX_cEXTi4yl4JEmGMb1Kux7tV4yPK4xPR0s32SL7ANHAjxaz9n7Nl7WUqgGIyT9krxx30T8aO00e5xBgFRw-vCLfpHz55mavpkbsv0SetWaDH-jgW7x18fy21YPr7lWdeH_j0qL4MTlUc69NwLaRuf7J4RAZb79kEWUWmz3Z0JEKR2Q; __cf_bm=hzUgqStugE.9.QiH4CzypSNuvXZgXbko24_3kK1.E2Y-1743854713-1.0.1.1-JfDDM0WOtV7Wsvg3i95ady23oFGSBt136VhVPKYjjsT8JiDkvev7HkZP6qfL8npCOidT6gdHCIdDw6TG8TthSZer9Vb4EUDTa22cMiLEaBUYv9FoE14fgid.2joGhAie; _cc_id=f903b8ab709334f274edc976ff145fbe; panoramaId_expiry=1744459565138; panoramaId=af700bbc2be8ab910a0c0e164707185ca02ce250eb51c39182d21ce9839464a1; panoramaIdType=panoDevice; cf_clearance=.wGiau3QrkHvx4UGtdCzx8UJDhk6kbjED_dzLvwvSoc-1743855660-1.2.1.1-XiYL2D9ddF8PRUiCtLjNEsNch58fGnHIlhPsFpOvsRdiQKe9DBUtGqZ53kpFAOkcrn4T_xupPZyW2bz_yhTjAzcj0.J8SsSQwp5pVF5qSq8eXRdOHkhnHgQKk.oV2ZgqXY8O3V65GpVHuRkOAZw_JK0xIs74vQ6a4wnruAoVKhjBpWvEu8RvBo7ezvsXmIKXXmiieuNkB_qZWgoIdzE7B9vREA_e8I.33eRTIbkqEXlnYE_T7QUVFrQmTnTpFt.448zqSWeDYsaaa3Qty32E2P_2nNpESVjTjz1GF8ASjW.wjFjjQZpg1jjyRPFskaE39a7Q5a3Uspy_tiYrIHWVrOWcdKyN4A9M1s2gJV_6YFE; viewport_size=764; __gads=ID=6bcd92b06d19d690:T=1743855665:RT=1743855665:S=ALNI_MYqFxhmJRGhaIXZpDHWNkW4RVAf4w; __eoi=ID=718f73f405f12ae8:T=1743855665:RT=1743855665:S=AA-AfjYWhhyTzU9x2XGU5o67F7Qq; cto_bundle=3aIfCV9INDNINmh1cXo2djFFdWlvN0ZVRU8yaGdvN3N6VGdMZ3R4dmkwWGRoTTdyYkZmZkZ4OW5xSURrWHRkTlRrMXUxaCUyQkhkSmVMRXJnTkZVSDNsTHdaUzJJcmxlSTklMkY1QjRNRWhhTE1YWmI4aWk2cDFKSlZHMHglMkY5U3Bkd2dKMFV2b3R1V0FSZmRSMmNCY3h2bkRDVDlubWclM0QlM0Q; seller_header_visits=4; datadome=ElkFzUy8SXK6bgnDmAc1bJCO3RPxuepJ_Vf~NzbSr4_iEoEjQQFOdvYBUTAms840YVlhXijFxvyXdZ06xmAE3OxpObLpk9P4N5a78xP22Fb7nLLfpDxppmLS0M0tK3Ll; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Apr+05+2025+14%3A23%3A40+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=263626377&interactionCount=5&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1%2CV2STACK42%3A1%2CC0015%3A1%2CC0035%3A1&genVendors=V2%3A1%2CV1%3A1%2C&geolocation=FR%3BIDF&AwaitingReconsent=false; _vinted_fr_session=Q1ZJNE5VZ1BnYWhacHRFMDc0cWtKVm1xTmp3QkxjN2JtTFdUc2RYMlR0NldiaWJsQlpDNGQyVjNUU1JOTDA1OThMS1F0T2NrcUwzQ25xSzRtL2MwRVEwdzN5cWJyRzJtcFlxQXZFb2tJR0NtZ3Q3elViVHdHOWxZQm4zcHVrYXlVWC9ibkJTQUF1dy9ZVStTdEVFTnpTYTAxSWt3OTA2anpMUGM0dFRDS1ZiKzRSWHZZMVJTeVZ3VDF0LzFjOXFqMm9mT1lpbXBxa2ovZ2krdEJ4NEtacDhkaUFOcW9sZUkxMkxpRDAvY2xhN1lsQkZXRzFtSmExc3hrMDljL0l0MjNESmR2UC9mSndITzdFWnV0Ny9HcWhOZS8zZlNqOXRRUzZNa1NDeVc5aEc5eDloWUJlNnF0V0tSUVNwRDRGR0hBSEtpVUNkbWthR3VWVTFNWExoKzhHcnpHRStXblRTaEZtUVFtWlJsUzkxMTlQcFEzbWo3a0paTDJ0TUZlMXIvMnpBejVKTktFU2F1SmMwbEJaV3ZsNFV3anNIUWMzZWJoeXVhN3hkckJZdUtQUFR3cTduRk1FNGJBeEpRdStvNHBrSWNMT0xFT1lFV0FPSXNvL2thUVU5dG82UzY1RUlvSUNDTTFkbDB5Y3lvQlpWT01lWGR0NnZYNFJhQWNSNy9sdTI5czNOVERGbmY1OWVabjBhZDRhd1NISFMyN1RVeGV2ZFk5OGlnd252Y3BWZWQzNW9QbXNrYldPNHdIV3FpY3ZId3diTFU3V2FlcmtwTVJMVmNsdlBjamFNaDBEVnFvbXdWM0pnUkxHU1FnOFB2SVNtam45TVpQbXA2blFKaVZESXhwbVhNV2NvaHY3NUVITENwaTJKUUFyaG5EZVUrbWV4bll0d0JEb01jSFl3ZU1iWjV6QUlpTXRYdVR4TDdnVjQ4cnRhQ1lFMkV1ZHVXUGFMUkdvbDhVWitHNkdSTDBrK3ExQW1vMndpbVc0NkhOUEtONGtOK0dZWWR3MTdqQWhxaitjcHdkWlF5SGY1dVZyOXYxM1BNb01lVjJaanNOY2FjK25vWkttbTdiK1lIaU5Hc0ZtY0I4aEo5ZG9UWm9VUjFWRHB2MHp4VWxxQlVzcFpzdER3VHYraVltQmcxdURCWnBoeTI3clpZTlMzZkN3T2NQcFRCN3NTREQvak01RFQvdXRoWkN2YWQreUpRb3FQNElwU3BYb1pDUTBNYURKcFVBSVhKbWJDcGZaZlVEcXNKdUZnbzFCeWc0OG9GZkdzUFNMRWVlcnl5RHB0eVgxVWlwTUhDRWxsdDJDUUI1VkxFd2ppVGhPRE9QeTdHVGZKTWp2NWw1eXBQMS85Rm9QT1ZFZ0FVcThuaFVsMlZpWjhvODNtT0FQeDdFR05ZRDhYSk1rMXJrZVYyQURVbnlBUEM4eThBVERzZVF5eGlSVmUrR2ZvdkswRE9SWklIQ2krbHEvbUpSRVBFbFEzN2FwSkttZWY1UklpUzg5K3dqcVB3c2ZrdE1iNWhOdFpRbHBOcm5iaUV4eGhBM3pjRXRqbjF3UytqaVJoRFZ5VTFJTU5FaFdTdWNCdis2Ymg4UGZlaXBBUVo4bWhZanJVbXNZR0lNMTBPYnZKZ25ZeFFlM1dMclYzYWQ2V0F2VURFVmFqRE84MCtLa1c0L2FqZmhhOE9jR1hFclFuVktJTHJKL2FaR01PTUhWRXFZaE5TdFBQK3dhTTd4Y2s3SjJBKzhxOVRjVTVUbnZ5ZWcxUG1xQjZQb21aS3VMYmRRQnNMYWVnVm1iblAzOVBYdjdaR3d4ekpJbllXOU9ib1EveHpYUEpSQ05CRXJOSXlhNlpZbUNDQ2NCN2Q4eE94bmxxZGM1Z2NYc3JTd0VuY0FUdlhwVTROS1p1dktNRHpXRm8zWHFvUnppdEl0aFFxNmNlNW02WWRPUWpGelFvMngzRVMyODVseEZVWFdYVnJOeEV3YjU0WWl3cTdlNkVvelYrOVMrcHpZdlg0QlpqMHRmU1lnQjQ5YkdKcWVkQ1RYUE43Zno2dnBLYUd5bjFmWllZV2pzdDdNTEdTdTJvdmUrOXRmU0RxL0JKMVZaekdPdnhTdDU4TWhPWUxhMVdyNDNlV2dERHVNT2xTZE5ZK0xYcWkzSUkxQmNkVmNvZEs1amUwc0dCa2EzbUppanFhM25ob0o1VnV6bHlMQWROdkNxTVhHZ3Y0NXZQZFp6MytQODgwclVQcWJtZko1Vi9DTnR3dWVrMnVNUVBvVVJMK2lnNVMvZ1FUdmFLRXovU0xPODZqSWN1RHB1bDBLcmZHbS9ESktNb2UxZlFMbFZWZXpNSmQ3cVVNdjNWeW1DVmxPZitPQzAyR0VKM0NMSFFyeW51VWpvVzF5OERsNHRmS1lGSk5XcmdXUFJ3amd2UFB2aGYwemowL3lPSDhiMVIwbFRka3FzdG9ZZFd3ZSs2RmE1T3ZFeUoyL1FTMUhycWpCODlXVjU4eU4yZngxYm1wcmZGWWZwZTNHM3JIREtzTlJjZE13clBhcTd4bGZsQXRkNEhvV2h2SVB6MEhySXhtanpBRVd3ZktDZjRCZkN0QVlQNUpESG5zUFFFZzF4NWVqR0ZZYlFXaXBVa3RuaU8yUktwSG1KZXRyY29TYnJUQUpuS0lOL0xrcElvaUNyQkVBVUplQTNkYVVzWFJrTWtuSGNMTVYwb2RTTU5VZnNTbERXMUV0RklXY3dSMFlPTktIZGdjQjlmTXl3PT0tLUoyaVlxVTBCS2pUM0tJZHRCeGdpdUE9PQ%3D%3D--f993e138c49c02a2bf2575f418fc21be51d12d96; _dd_s=rum=2&id=5152f01e-b33a-4ab3-b695-153d507c3f4d&created=1743854606409&expire=1743856720511; _ga_8H12QY46R8=GS1.1.1743854606.1.1.1743855820.0.0.0; _ga_ZJHK1N3D75=GS1.1.1743854606.1.1.1743855820.0.0.0; banners_ui_state=PENDING"
  };

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const json = await res.json();
    const items = json.items.map(item => ({
      title: item.title,
      price: item.price,

      brand: item.brand_title,
      url: `https://www.vinted.fr${item.url}`,
      user: item.user?.login,
    }));

    fs.writeFileSync(
      `vinted-deals-${query.replace(/\s+/g, '_')}.json`,
      JSON.stringify(items, null, 2),
      'utf-8'
    );

    return items;
  } catch (err) {
    console.error('❌ Vinted scraping failed:', err.message);
    return [];
  }
};

module.exports = { scrape };