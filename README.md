# 꾹꾹이

> 종이 쿠폰을 대체하는 간편한 전자 스탬프 플랫폼
- 꾹꾹이를 사용하는 모든 카페에서 쉽고 간편하게 스탬프를 **적립**하는 서비스
- 마시고 싶은 음료를 **검색**해 가까운 매장을 알려주는 위치 기반 서비스
- 적립한 스탬프를 친구에게 **선물**하는 스탬프 이체 금융 서비스

### App Client Repository

### `가입 및 로그인`

![가입 로그인](https://lh3.googleusercontent.com/PeXnS3bd1n10zjU8jkwbGnW9Nfi4Ut_FRfoGXB2ZbogDf8ABS2jDa7RFkwrxE_xgDjh1qVe9_ay2_q1Pobp_Y1A_XopHAIY4y4UwqvRv_2ShGpVrQZrGp0iewBj18uq3tpSXKtYgwd9ZgSZgOWLN1RFSsz3RLyL0BlEt0mPSK-cYImiXNS8H86_7XSQZeuMUMix9GGs1l9hczTp3KlDPKz429BOxKspDhyOdUAuIngbdVZ63xDoh0iUiUPDw1x6zZcqm1h-0qDqDk0LoUlzwfxC2hHdXPBVY8re5f5VbvU91PsX1BGQ5GMXLSfkg-pV0I9RhUEQgzheoFEwOrST_Ct4HZXQ68S3if26kF0BsnP_jHMeUqqFbLyXPoUA6lW0M7f9oNt4t3SOs7J-nJfopPtDeyP7VByDk9HH4Rf6NlUNtEpQs4THk6KSng38MKarbhsSY7xU8lqIVZ_ZgVjKTkYtPRPAQrQvyf6292y78786ubTVtGJVPJ6SUHgyhr1uqRhasNvgi6RB3DTkXh_FZZAWe_ed4cnNsEC7APn6k-MB9r6K1EaX5hDbEr8NzNv5eUaKjOGlP5FSZZp9kn05Rm_QlzM4jVSZ9c63fX_reXmrEyVQuZQhQMr9rIf50F36yOnuHhdozzfPKgssgrdHVSeXCQ1OgjQ=w101-h220-no)

신규 사용자(손님)가 앱에 가입 및 로그인 하는 기능입니다. 로그인에 성공했을때 서버로부터 토큰을 발급받으며, 토큰이 유효한 기간 동안은 앱을 켤 때 자동 로그인됩니다.

### `스탬프 적립 요청`

![스탬프 적립](https://lh3.googleusercontent.com/l9oUuEk9S4C5OhdfzLmuy8hI3yEdaK6x-wTRkNmGfaBZKAlZ7PecQ8c9K5wjiZQgO0ig-a-CTU5ndegesy5AIyiy1Th4qc68T3mElgJkDpqGUZBp1lTbn2Qs0_W4C5XHoe5M1r9iI_7OR_iZ8IIigqxD19iUOQB7oHR0nWsbh0f0hBT3-GS4kfty7SVrzN-onZAQGDof3mq33DpJp9KWcgXFYPLsbeko9OYUN-hGaXPR7J9L817oDChMTUVV56iAHQQKsoMAVslRkNrp09McepRMjNotNsJ88tEs5zT9scA6Zr6JY9rXLJkxlpP0Q-awCA3C_C_N8t8un4Nx6JlfMmJOJuwwQ_j6vNdeR0MVgoym7OMaYgOmnOOc4ZShva3x_SpQR_6T6HL9KzgnrFE0alUI62NAHLtJkVXHfW9quhKaP0n0DSHTtHLKl2Q-ZJkld5nIHdIIEEYd2R-YUwyWP5uToI36v6wXwuYHMxzNg87lybLT6ryb5FUSxfEG3x0aSDlXF-oS3YZre_KF-jzDHQFbOOLFOiD3wLV1AYipC-U3zygrjPZlQVTkLiiDoT6Cz5auueQNqM_1KFIQsv3bQpgMeFPQqrhoKruJA0J2e2ruyxoH4AlLGXPp6rbzPu29sAZ3FunHpmvMdoNKq8MFCMrjt6EZPQ=w794-h464-no)

손님이 매장 안에서 앱을 켰다면, 가장 가까운 매장인 현재 매장이 자동 선택됩니다. 손님은 적립 버튼을 누르기만 하면 매장 사장님에게 적립 요청이 발송되며, 사장님이 한번의 클릭으로 스탬프 적립을 승인합니다.

### `교환권 획득 및 사용`

![교환권 획득 및 사용](https://lh3.googleusercontent.com/M2-1mndOpop-r35yWoAhXn-VMv3-QtVEwJpUnmzGQQ54euwFqs383u47D1eR9C9MJf4K1vlGN9KRiwJsMXgyM0mNlXGEmsf3JPBaQ60lafUSBz1FRpNPvNyg0RMBcxbNhH7-MVlweHUSvQZERKybCb7gBrQGkM4KKgtkfrUrz-bbLKPqhKlAECH4aJdSF5fmKiOZdcQHvb2k8nEGJFeqiS2BA7Xj4kPCpBSspy3SIMsAuxsWJq3L4fo765ElSzuP4zcJt1yFHnPBD3CM_NaRc1NqNUfi3ErBNHQjmLFJ8CNBQGyEr2SBrNfCxtKwHE_RXiaxKdBxQ8oMyLkF1FzySKWdRZ1GxjOBwJ68CuBEcvzAdsXh3pXQ2m7MWmYLpE97D5XEhljSkQPaW4JrSky7qcnqSiLqqlfP0tWmILjOu82OYFq86loWo9ea6b4fO2n7uMuObWs8LWd650d-dRpsWNPq3gDGLUuluFHDwjy_gME5CyFREd3bd56r2pDX2K714CKK5f2ViO3zKN0AtQ37ZRx9Pjv_6nhA9ui5ScgH9Sq3CPX7sDVulqWFIqu4yGMKPT7xrI4Se4f0-SBg6fgXDklskDPB4hUYNmL4PYNOKXd90bf6WkLBEYirK7gYO0rEyiK-jG8qeBH1mHX-zjyRgIS1wDI1VA=w794-h464-no)

스탬프를 충분히 모았다면, 무료 음료를 받기 위한 교환권을 획득할 수 있습니다. 교환권을 사용할 때 매장 사장님에게 사용 요청을 발송하고, 사장님의 승인을 받아 교환권을 사용하게 됩니다. 교환권을 사용했으니 손님은 무료 음료를 제공받습니다.

### `다른 손님(앱 사용자)에게 스탬프 선물`

![앱 사용자에게 스탬프 선물](https://lh3.googleusercontent.com/P5DpHWbH-UjQCTJ9fll_-utWU8v4MQhiH7uy-HlFgk9iFr9fBC_OyDdReau1HSSHHG4zDll8FabOam5ehh2UHfKFD91TisTBe5-ewZwklZ5HUEwu28367zHwcAebFmYHQp_aUVdAewo32RhQvILnDISWL8wyfWVWRv67mfEWScx0dN_JSZgwlK9ShD66lz0LPNQ3i3Hw9OYZ0fqxY6eVqCZN2NZzQJjtjeGDN7pC2Cx0yDYDdh843uxy68IHOA5yjWZmSpvikvtlpUqg9w_eVJNI2eQOd1Lrn3befuls2zooOU9RaPNbuQO8rt4BKtBiWODNPxmp--fPqaZAQWFl8M44Ud-xXRMhZlu97TAffjd2BKH_jR3zknPNDmLqQqqSTdAcuvlCWSWqA3z521EX_OzWupvjtlx7QOumEOyaDoyUiIH5lLo-njzKDamBHqnNJNIhJOD7-tTLUzsBpjOjt2F9MWLq61rPkpN73X31oCyKNhXPgKeM3pnwarQ_BGAZ4_m6c9lMEz0KULPDqpH-UarN8AQNGGD52hQc089feipiq72avumHPMD2582fsB33xWDNSVpe2zESDGo4sKBIIvii6neXXjsWOk-S7zsSOvzvn4eMFBmPkMYjp5U2rX4SdLfDUJkJFDSFvUrpX0HvkNIpRWi6ug=w392-h848-no)

꾹꾹이 앱을 사용하는 다른 손님에게 스탬프를 선물하는 기능입니다. 대상의 연락처를 입력하고, 바르게 입력했다면 사용자의 이름과 보낼 스탬프 개수를 확인합니다.

### `다른 손님(앱 미사용자)에게 스탬프 선물`

![앱 미사용자에게 스탬프 선물](https://lh3.googleusercontent.com/_ok_0tV_Uuuqfpjn_PqOPsbGcof-IqoZQN-aayG7iLg9f803GJ5FUO-VdH8mNBvEpfYosuR178ATjUzE-6Tw6xzrTN02uGwaVVN-YwaSFo1fUFkVYiW4L8BfCuZ4OXo6QWWDatolLN7I5Lrp89LPxNSF5cy880JHELB1xx39NXL_2YT97413PhY6Z95VWOAIY-LnE29FjyaGnTE-VY0Ar2f2tZ23jXcQWuC1XoENY1RP2yiVwR0cicKX1cM3iJQSZhUbCchqPLLJoIt63kn2g7MQA5ntd1sdrP482LhAYVlMfQ58O7GK2AoPOn_Eu5iyAABPDrqagUYrHGNrS95buVwTPcXrgIN-qg0bKVsXinvS9T9eUXSbDq4pjBE6WDvWPmfjMS6yjdXt1WjrDmafm6nisY-8gv5_Q5G3p6eyP8LcBFeKmbwSUoqyc8zFrZHFQjIKwJWETv9Vx0B9wOQRrPWs-aQJ-hbvEWWlabmCFMUzfruBjx39CxGwb7KSqyq_iHsrdmkysf922NlTQsYbmI-Dd2sNsVfF3G8I-RHsCLbSxY8ZCmbT5ScjP0IQDldQjD7Oep7R6Ru1KFdAHINFv9tm8I_vLpJyqut9Hmx2whQzEol2vP7IlTvzftKm8wImEcQBeFX5H-hnoZID5F6TjlMdH4CAig=w399-h233-no)

꾹꾹이 앱을 사용하지 않아도 매장에서 손님 등록을 했다면 스탬프를 선물받을 수 있습니다. 매장 관리자가 신규 손님의 연락처를 입력받아 손님을 꾹꾹이 DB에 등록할 수 있고, 몇 번의 클릭을 더 해서 스탬프 적립도 가능합니다. 앱 사용자는 그 손님의 연락처로 검색하여 스탬프를 선물할 수 있습니다.

### `음료 기반 매장 검색과 정렬, 필터 기능`

![검색, 정렬, 필터](https://lh3.googleusercontent.com/kMboST3dj1jk0UVGH8vtEuJrtHmogGfpn5far5RP0SBjUEutmz8rqhmeXJK6eOmv2ZJLBGZQ4eYmTEITOOsHDjfMswUVomswR6ZRvkysogacn6fhvylrUs4HSwXh3-dPOr78po-GUyUZKKyaCfJpMt5gEKL99d6BsdGlw-H6VIIvXuakKjj9TFL_4x2v0Wht5UHGFO7oEmmCRMvlKPLYOiTU2WpiAgsVoLC8PF0i8gTpO1noOVlzSnUIr24z90owZ026sFWcFwIPGFOjBP_aL7I3yK2Fl-P0AxU2zNvlNPVxXsk0cmJ5PNpVEI1b2qcV5ONC-vmgC4TPZAdRT4iR4vfnWTZvunEG7utb3COIZzyK1Y2NhbophxXLeYS-p21gM_1e-gvVjSM_NY85XIHDuoGFaTd3TEDG4tG8g-mqJmOCPRXP1bTYPewD9isee0ZxCVK-sji3j7yuWGE7vxDiomof05FWGjF1i3Ei8uGYI9SyLDCZ07Rz8elFiI5d3iMUgPAXo-zOBpBk6PL7EjRjzHhLvZjCwSPzBbNgJxrUdDb2YWu9nEYEfSezfk-ycEyNXAUjLvhytUgaKuCZeQKA9itVJ4TrI7Zio9QDC-i54ihtbpN_3XL0OyYvr8iExUciy7vLxpZNSur3ZcbM0YyJwcjbKhpwbw=w108-h233-no)

'리스트레토'를 파는 근처 매장을 찾고싶다면? 꾹꾹이 앱에서 원하는 음료로 매장을 찾을 수 있습니다. 검색어를 입력하면 내 주변에 해당 메뉴를 판매하는 꾹꾹이 앱 가맹점이 검색됩니다. 현재 영업중인 매장이나 내가 교환권을 갖고있는 매장만 골라 볼 수 있고, 거리 / 내가 적립한 스탬프 개수 / 검색한 메뉴의 가격 순으로 검색 결과를 정렬할 수 있습니다.

### `매장 상세 정보 조회`

![매장 상세 정보 조회](https://lh3.googleusercontent.com/juLdLTPEnSD22TYrSI0fNKvOFLGwG1VfXuk7zbJbM_OD7q3fXVOvrj_ofy68s1b6SpWVjd4hsCwh33U_ae8XQR1zUKER1n_yhyKJctTttUOaewsbDOSJDSqFDei-zECA9qlr7as6UdBo_z8HGri98LrNuhRZRiu1ltc8hUJRbAqn5-rc4mltIsnp89ot8-XicC3eIODt7DWkm3ZRq1XeKR0pkIz6dxNURQEm8ToypGvkbmWoqWv5Pj_WGC17xvifbIYMboeG3dtwcFAmJnFNAZlvDvSENOpiNV-lKI_z-laeypcWIohqt01KrAvf_oq4-cTh2itiY-KksmUzqzQNDBCA2pVg3BJUp2XwMZByTmwzw1njUfm-jsGzzKyzw8n7Tkkc70k5pmuXZFnF7bnPmdT9Zz2IQonrHTzdAK6dQp-zCeAgp0doceTAE-sYhFwTcBm57RATCTXvTUbb0VJ-jYj2lobI9_c4-UOogWMr4cMg2_3QtNABfS2DhXQ2fA1hagPqkLcXLrdM-uZn9BkRnlQCbyXwYCUyCSOpPMPMPGh_UaX2h3QCXQudi5D3YzU9ZYaKoaedUxBzt29Ye2cWYnn7FhBoPlZBsxgXQdrHi1wiYL2NARc0Rshrbxmkr9B-Dgm-EC5f9kluweRzrT0OjTYpOrcIWQ=w107-h233-no)

검색한 매장의 상세 정보를 조회하는 기능입니다. 스탬프 정보와 더불어 매장의 사진 / 주소 / 영업 시간 / 전화번호 / 메뉴 및 가격 / 지도를 보여줍니다.

### `로그아웃`

![로그아웃](https://lh3.googleusercontent.com/yFiQrAcKZRiuKjFSUm-bE-DeRjp4YtN_l7P5QKxyEGwED6paXDtzcCqp60YYt7D3cLpJHR6M8UuXKHFYpDvA9nYKMBCfEbWxRZLGziVxR8s079f4vUDBrhadFPme_SwxD4wp9RKLROYVE4v7bMwcRM7OvI_Zrrg58gjKFV4DHK7qs2M3TIzt-j4oxt8IgevyvStIrWtZMJtX_as4ugXxSrDr_81dFU92CK52FZ2MymxC2XyD_Cy-QQynXDrljdt7t5kmeuGB-XQX-VgRWuTWavs2NLs1KZAGYhYE-9PQC97m55LDS89xR-HO-5yS1mz4hmAR_Q-EiByNRe44HOZ8v-AC6m-dKJCJ5c4c7fdoALJke50N8iqMPZlDOYDH1Qawb5Exjd_jX7IO_-35jrpm3dyGrvKo8fPk9SS_Ly_xDq4OZwjQzhe0xCzLUe-P1P_z2jI5wv3Gkr-R17_S97SAp_M6VNbaBCToBytmsV987A-ir2iab6H0eB1tOjjol3YSq_Js0-wLAJ-yjA2rryc6R3UxDAI-CKJyUbMTVdXXS57e62TqzjJx1lbhO5EXn3hnMYglmHAFdGxgVue5axrgS4DUKlPAphnzVTwVM_wHtfI8gIgeziqQGecCvYcVtU9R-14KFqHzzVEju-1ZQp3yvZDxb85a0Q=w107-h233-no)

로그아웃 기능입니다.