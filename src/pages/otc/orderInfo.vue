<template>
  <div class="wrap">
    <div class="content-wrap">
      <div class="content">
        <div class="left u-relative">
          <div class="tit u-p-20 u-flex u-row-between">
            <!-- 订单已取消 -->
            <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 0">{{ $t('orderInfo.ddyqx') }}</div>
            <!-- 待付款 -->
            <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 1">
              <!-- 待我支付-->
              <div v-if="isBuy">{{ $t('orderInfo.dwzf') }}</div>
              <!-- 待对方支付 -->
              <div v-if="isSell">{{ $t('orderInfo.ddfzf') }}</div>
              <div>
                <div class="u-font-14">
                  <u-count-down
                    ref="uCount"
                    font-size="28"
                    :timestamp="timestamp"
                    :show-days="false"
                    :show-hours="false"
                    color="#515a6e"
                    separatorColor="#515a6e"
                    @end="countDownEnd"></u-count-down>
                  {{ $t('orderInfo.qxdd') }}
                </div>
              </div>
            </div>
            <!-- 确认付款 -->
            <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 2">
              <!-- 等待卖家确认收款 -->
              <span v-if="isBuy">{{ $t('orderInfo.ddmjqr') }}</span>
              <!-- 待我放币 -->
              <span v-if="isSell">{{ $t('orderInfo.dwfb') }}</span>
            </div>
            <!-- 申诉 -->
            <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 3">申述中...，请耐心等待</div>
            <!-- 完成 -->
            <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 4">
              {{ $t('orderInfo.ywc') }}
            </div>
            
            <div class="hidden-xs">
              <span class="u-font-14">{{ $t('orderInfo.ddbh') }} {{ orderInfo.id }}</span>
            </div>
          </div>
          <div class="info u-p-20">
            <div class="price-info u-font-18">
              <!-- 总价 -->
              <div class="item u-p-r-30">
                <div class="u-font-14">{{ $t('orderInfo.zj') }}</div>
                <div style="color: #19be6b" class="pay-font">{{ toFixeds(orderInfo.sourceAmount) }} {{ orderInfo.fiatCurrency}}</div>
              </div>
              <div class="item u-p-r-30">
                <div class="u-font-14">{{ $t('orderInfo.sl') }}</div>
                <div class="pay-font">{{ orderInfo.settleAccount }} {{ orderInfo.currencyName }}</div>
              </div>
              <div class="item">
                <div class="u-font-14">{{ $t('orderInfo.dj') }}</div>
                <div class="pay-font">{{ toFixeds(orderInfo.posterPrice) }} {{ orderInfo.fiatCurrency }}</div>
              </div>
            </div>
            
            <div class="u-flex u-p-t-30">
              <span style="width: 100px;" class="u-font-14 u-tips-color">{{ $t('orderInfo.mjskfs') }}</span>
              <span class="u-flex-1" style="height: 1px; border-bottom: 1px solid #eee"></span>
            </div>
            <div v-if="orderInfo.status != 0">
              <div class="init u-flex u-m-t-30"
                v-if="isBuy"
                >
                <Icon type="ios-alert" size="20" sytle="color: #f90"/>
                <span class="u-p-l-8" style="color: #333">{{ $t('orderInfo.qwbsy') }}（{{certificationInfo.cardName}}）{{ $t('orderInfo.zxzz') }}</span>
              </div>
              <div class="u-m-t-30 u-flex u-font-14" v-for="(item, index) in orderInfo.paymentList" :key="item.paymentId">
                <span class="u-m-r-30 icon-btn"
                  :style="{color: item.payTypeId == 4 ? '#1bb1f3' : item.payTypeId == 3 ? '#42c71b' : '#f1bc15'}">
                  {{ item.payTypeId == 4 ? 
                      $t('trade.zfb') : 
                      item.payTypeId == 3 ? 
                      $t('trade.wx') : 
                      $t('trade.yhk')
                  }}
                </span>

                <span class="u-p-r-30">{{ item.kycName }}</span>
                <span class="u-p-r-30">{{ item.account }}</span>
                <span>{{ item.accountInfo }}</span>
              </div>
              <div class="u-flex u-m-t-30">
                <div v-if="orderInfo.status == 1">
                  <Button type="primary" @click="confirmModel = true"
                    v-if="isBuy"
                    >我已转账，下一步</Button>
                </div>
                <div v-if="orderInfo.status == 2">
                  <!-- 我已收到转账，下一步 -->
                  <Button type="primary" @click="receivedModal = true"
                    v-if="isSell"
                    >我已收到转账，下一步</Button>
                  <!-- 买家未收到资产，申述 -->
                  <div v-if="isBuy">
                    <span class="u-p-r-10">{{ $t('orderInfo.ddmj') }}</span>
                    <Button type="primary" @click="showPlead = true">{{ $t('orderInfo.ss') }}</Button>
                  </div>
                  <!-- 卖家申诉 -->
                  <Button class="u-m-l-10" @click="showPlead = true" v-if="isSell">{{ $t('orderInfo.ss') }}</Button>
                </div>

              </div>
              <div class="u-text-right" style="position: absolute; right: 20px; bottom: 20px;">
                <Button type="text">{{ $t('orderInfo.lxkf') }}</Button>
                <!-- 取消订单 -->
                <Button type="text" v-if="orderInfo.status == 1 && isBuy" @click="cancelModel = true">{{ $t('orderInfo.qxd') }}</Button>
              </div>
            </div>
            <!-- 订单已取消 -->
            <div class="order-cancel u-tips-color" v-if="orderInfo.status == 0">
              <div class="u-p-t-20">
                <!-- <Icon type="ios-eye-off" size="50"/> -->
                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iODBweCIgaGVpZ2h0PSI4MHB4IiB2aWV3Qm94PSIwIDAgODAgODAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU0LjEgKDc2NDkwKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT7nvJbnu4QgODwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxjaXJjbGUgaWQ9InBhdGgtMSIgY3g9IjQwIiBjeT0iNDAiIHI9IjQwIj48L2NpcmNsZT4KICAgICAgICA8ZmlsdGVyIHg9Ii0xMy4xJSIgeT0iLTEzLjElIiB3aWR0aD0iMTI2LjIlIiBoZWlnaHQ9IjEyNi4yJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iZmlsdGVyLTMiPgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxMCIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd0JsdXJJbm5lcjEiPjwvZmVHYXVzc2lhbkJsdXI+CiAgICAgICAgICAgIDxmZU9mZnNldCBkeD0iMCIgZHk9IjEiIGluPSJzaGFkb3dCbHVySW5uZXIxIiByZXN1bHQ9InNoYWRvd09mZnNldElubmVyMSI+PC9mZU9mZnNldD4KICAgICAgICAgICAgPGZlQ29tcG9zaXRlIGluPSJzaGFkb3dPZmZzZXRJbm5lcjEiIGluMj0iU291cmNlQWxwaGEiIG9wZXJhdG9yPSJhcml0aG1ldGljIiBrMj0iLTEiIGszPSIxIiByZXN1bHQ9InNoYWRvd0lubmVySW5uZXIxIj48L2ZlQ29tcG9zaXRlPgogICAgICAgICAgICA8ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAgIDAgMCAwIDAgMCAgIDAgMCAwIDAgMCAgMCAwIDAgMC4wMiAwIiB0eXBlPSJtYXRyaXgiIGluPSJzaGFkb3dJbm5lcklubmVyMSI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgIDwvZmlsdGVyPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iNTIuOTA1MDEyOCUiIHkxPSI2My4xMDcyMTEzJSIgeDI9IjUyLjkwNTAxMjglIiB5Mj0iMTMzLjIwODg2NiUiIGlkPSJsaW5lYXJHcmFkaWVudC00Ij4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0ZGRkZGRiIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjRUFFREY0IiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxyZWN0IGlkPSJwYXRoLTUiIHg9IjAiIHk9IjAiIHdpZHRoPSI1OS4xMDQ0Nzc2IiBoZWlnaHQ9IjM5LjMzMzMzMzMiIHJ4PSI0LjQ5MjgiPjwvcmVjdD4KICAgICAgICA8ZmlsdGVyIHg9Ii0zMS4zJSIgeT0iLTM2LjklIiB3aWR0aD0iMTYyLjYlIiBoZWlnaHQ9IjE5NC4xJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iZmlsdGVyLTYiPgogICAgICAgICAgICA8ZmVPZmZzZXQgZHg9IjAiIGR5PSI0IiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIj48L2ZlT2Zmc2V0PgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI1LjUiIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUdhdXNzaWFuQmx1cj4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMSAwIiB0eXBlPSJtYXRyaXgiIGluPSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlQ29sb3JNYXRyaXg+CiAgICAgICAgPC9maWx0ZXI+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0i5Lqk5piT55u45YWz6aG16Z2iIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i6K6i5Y2V6K+m5oOFSDUr5Y+W5raI6K6i5Y2VIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQzLjAwMDAwMCwgLTQ2MS4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC04IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDMuMDAwMDAwLCA0NjEuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay0yIiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgIDwvbWFzaz4KICAgICAgICAgICAgICAgIDxnIGlkPSJNYXNrIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICAgICAgICAgIDx1c2UgZmlsbD0iI0YyRjZGQSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgPHVzZSBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIxIiBmaWx0ZXI9InVybCgjZmlsdGVyLTMpIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtNSIgbWFzaz0idXJsKCNtYXNrLTIpIj4KICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMC4wMDAwMDAsIDIwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i5YiG57uEIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAtMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i55+p5b2iIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIxIiBmaWx0ZXI9InVybCgjZmlsdGVyLTYpIiB4bGluazpocmVmPSIjcGF0aC01Ij48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTQpIiB4bGluazpocmVmPSIjcGF0aC01Ij48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oi1jb3B5LTQiIGZpbGw9IiM5QUE1QjQiIG9wYWNpdHk9IjAuMjAwMDAwMDAzIiB4PSIwIiB5PSI4Ljk5MDQ3NjE5IiB3aWR0aD0iNTkuMTA0NDc3NiIgaGVpZ2h0PSI1LjYxOTA0NzYyIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oi1jb3B5LTQiIGZpbGw9IiM5QUE1QjQiIG9wYWNpdHk9IjAuMjAwMDAwMDAzIiB4PSI2LjgxOTc0NzQyIiB5PSIyMi40NzYxOTA1IiB3aWR0aD0iMjIuNzMyNDkxNCIgaGVpZ2h0PSIzLjM3MTQyODU3Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oi1jb3B5LTQiIGZpbGw9IiM5QUE1QjQiIG9wYWNpdHk9IjAuMjAwMDAwMDAzIiB4PSI2LjgxOTc0NzQyIiB5PSIyOC4wOTUyMzgxIiB3aWR0aD0iOS4wOTI5OTY1NiIgaGVpZ2h0PSIzLjM3MTQyODU3Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oiIgZmlsbD0iI0VCRURGMCIgeD0iNDEuOTEwNDQ3OCIgeT0iMjIuOTQ0NDQ0NCIgd2lkdGg9IjEwLjc0NjI2ODciIGhlaWdodD0iOC43NDA3NDA3NCIgcng9IjEiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTYiIG1hc2s9InVybCgjbWFzay0yKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCAyNy4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE5LjgyNzgyOSwxLjU1MjA1MDQ3IEMyNy43MzgxNjI2LDEuNTUyMDUwNDcgMzQuMjAwMjYsNS4wNjMwOTE0OCAzOS4yMTQxMjEsMTIuMDc1NzA5OCBDMzkuODExNTc4MiwxMi45MTMyNDkyIDM5LjgxNjM1NzgsMTQuMDE1NzcyOSAzOS4yMjM2ODAzLDE0Ljg1MzMxMjMgQzM3LjA1MzcxNTcsMTcuOTMzNzUzOSAzNC41ODc0MTIyLDIwLjMzMjgwNzYgMzEuODI5NTQ5NywyMi4wNTk5MzY5IEwzNS4xNDE4NTI1LDI1LjI2MzQwNjkgTDMzLjM0NDcwMTIsMjcgTDcuMTkwNDEzODYsMS43MzE4NjEyIEw4Ljk4NzU2NTE5LDAgTDExLjk2NTI5MiwyLjg3Njk3MTYxIEMxNC40ODQxNzE2LDEuOTgyNjQ5ODQgMTcuMTQ2NDQxLDEuNTMzMTIzMDMgMTkuODI3ODI5LDEuNTUyMDUwNDcgWiBNMjYuNTAwMjMxMywxNi45MTY0MDM4IEMyNy4xMDcyNDc4LDE1Ljg5NDMyMTggMjcuNDQ2NjAzNSwxNC43MTYwODgzIDI3LjQ0NjYwMzUsMTMuNDYyMTQ1MSBDMjcuNDQ2NjAzNSw5LjUxNTc3Mjg3IDI0LjAzMzkyNzksNi4zMTIzMDI4NCAxOS44MjMwNDk0LDYuMzEyMzAyODQgQzE4LjU2NTk5OTQsNi4zMTIzMDI4NCAxNy4zODU0MjM5LDYuNTk2MjE0NTEgMTYuMzM4Njc4OCw3LjEwMjUyMzY2IEwxOS4zMDY4NDYzLDkuOTc0NzYzNDEgQzE5LjQ3ODkxNCw5Ljk1MTEwNDEgMTkuNjUwOTgxNyw5Ljk0MTY0MDM4IDE5LjgyNzgyOSw5Ljk0MTY0MDM4IEMyMS45MzU2NTgxLDkuOTQxNjQwMzggMjMuNjM3MjE2MywxMS41NDEwMDk1IDIzLjYzNzIxNjMsMTMuNTE0MTk1NiBDMjMuNjM3MjE2MywxMy43MTc2NjU2IDIzLjYxODA5NzYsMTMuOTE2NDAzOCAyMy41ODQ2NCwxNC4xMTA0MTAxIEwyNi41MDAyMzEzLDE2LjkxNjQwMzggTDI2LjUwMDIzMTMsMTYuOTE2NDAzOCBaIE03LjI5MDc4NjY4LDUuMjUyMzY1OTMgTDEyLjgzOTk2OTQsMTAuNjA4ODMyOCBDMTIuNDMzNjk4NCwxMS40ODQyMjcxIDEyLjIwOTA1NDUsMTIuNDQ5NTI2OCAxMi4yMDkwNTQ1LDEzLjQ2MjE0NTEgQzEyLjIwOTA1NDUsMTcuNDA4NTE3NCAxNS42MjE3MzAyLDIwLjYwNzI1NTUgMTkuODMyNjA4NywyMC42MDcyNTU1IEMyMC44MzE1NTcyLDIwLjYwNzI1NTUgMjEuNzg3NDg4NywyMC40Mjc0NDQ4IDIyLjY2Njk0NTcsMjAuMDk2MjE0NSBMMjcuMDE2NDM0MywyNC4yOTgxMDczIEMyNC42OTgzMDAzLDI1LjAyNjgxMzkgMjIuMjcwMjM0MSwyNS4zODY0MzUzIDE5LjgzMjYwODcsMjUuMzcyMjM5NyBDMTEuODU1MzU5OSwyNS4zNzIyMzk3IDUuMzkzMjYyNTQsMjEuODY1OTMwNiAwLjQ0MTUzNzA4MywxNC44NTMzMTIzIEMtMC4xNTExNDA0ODEsMTQuMDE1NzcyOSAtMC4xNDYzNjA4MjMsMTIuOTA4NTE3NCAwLjQ1MTA5NjM5OSwxMi4wNzA5Nzc5IEMyLjQ4MjQ1MDk1LDkuMjIyMzk3NDggNC43NjcxMjczNyw2Ljk0NjM3MjI0IDcuMjkwNzg2NjgsNS4yNTIzNjU5MyBMNy4yOTA3ODY2OCw1LjI1MjM2NTkzIFoiIGlkPSLlvaLnirYiIGZpbGw9IiNCMEJBQzciIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTkuNTMxNDkwMiwxNy4wODIwMTg5IEMxNy42MjkxODY0LDE2LjkzNTMzMTIgMTYuMTIzNTk0MiwxNS40ODczODE3IDE2LjAyODAwMTEsMTMuNjk0MDA2MyBMMTkuNTMxNDkwMiwxNy4wODIwMTg5IFoiIGlkPSLot6/lvoQiIGZpbGw9IiMzNTdDRTEiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTkuMzA2ODQ2Myw5Ljk3NDc2MzQxIEwyMy41ODQ2NCwxNC4xMTA0MTAxIEMyMy43MDk0NjE5LDEyLjU1ODI3MDUgMjMuMjc4ODMzOCwxMS40NDM1OTE3IDIyLjI5Mjc1NTgsMTAuNzY2MzczNSBDMjEuMzA2Njc3OCwxMC4wODkxNTU0IDIwLjMxMTM3NDYsOS44MjUyODUzNSAxOS4zMDY4NDYzLDkuOTc0NzYzNDEgWiIgaWQ9Iui3r+W+hC0xOCIgZmlsbD0iIzM1N0NFMSIgZmlsbC1ydWxlPSJldmVub2RkIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" alt="icon">
              </div>
              <div class="u-p-t-20">{{ $t('orderInfo.bkck') }}</div>
              <div class="u-p-t-40">{{ $t('orderInfo.ryyw') }}</div>
              <div class="u-p-t-10">
                <Button>{{ $t('orderInfo.lxkf') }}</Button>
              </div>
            </div>
          </div>
        </div>
        <!-- 聊天室 -->
        <div class="right hidden-xs">
          <div class="r-top u-p-20">
            <div class="u-flex">
              <div class="avatar u-m-r-10 u-font-bold">
                <em class="u-font-16">{{
                  orderInfo.adSide == null ? 
                  orderInfo.adName && orderInfo.adName.substring(0, 1).toUpperCase() : 
                  orderInfo.kycName && orderInfo.kycName.substring(0, 1).toUpperCase()
                }}</em>
              </div>
              <div>
                <h4 class="u-font-18">{{orderInfo.adSide == null ? orderInfo.adName : orderInfo.kycName }}</h4>
                <span>对方信息已认证</span>
                <Icon type="ios-checkmark-circle" size="16" color="#007AFF"/>
              </div>
            </div>
            <div class="u-flex u-p-t-10">
              <div>
                <p class="u-tips-color">30日成单数</p>
                <p>00000</p>
              </div>
              <div class="u-m-l-60">
                <p class="u-tips-color">30日成单率</p>
                <p>00%</p>
              </div>
            </div>
          </div>
          <div class="r-con u-relative">
            <div class="chat-content u-font-12" id="chat_content">
              <p class="u-p-t-20 u-font-12 u-text-center" style="color: #9aa5b5">{{orderInfo.createTime}}</p>
              <div class="u-m-t-10" :class="item.uuid == userInfo.uuid ? 'chat-right' : 'chat-left'" v-for="(item, index) in messageList" :key="index">
                <div class="system u-text-center" style="color: #9aa5b5"
                  v-if="item.type == 'SYSTEM' && item.uuid == userInfo.uuid"
                  >{{item.message}}</div>
                <div class="text" v-if="item.type == 'TEXT'">
                  <p>{{item.message}}</p>
                </div>
                <div class="img-wrap" v-if="item.type == 'IMAGE'">
                  <img :src="item.message" alt="img" style="width: 100px;" @click="previewImg(item.message)">
                </div>
              </div>
            </div>
            <div class="u-p-10 bot-wrap u-flex">
              <Input style="width: 100%;" :disabled="messageImgLoading"
                v-model="message" placeholder="输入消息，回车发送" @on-enter.stop="sendMessages"></Input>
              <div class="u-relative">
                <Upload
                  ref="upload1"
                  :before-upload="beforeUpload"
                  :on-success="handHandleSuccess"
                  :headers="uploadHeaders"
                  :action="uploadUrl"
                  :show-upload-list="false"
                  style="position: absolute; width: 100%; height: 36px; opacity: 0; cursor: pointer;">
                  <Button></Button>
                </Upload>
                <Button icon="md-image" :loading="messageImgLoading" class="img-btn"></Button>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      <div class="bot-info u-p-t-40">
        <p>1. {{ $t('orderInfo.mjzsxm') }}</p>
        <p>2. {{ $t('orderInfo.xmjfk') }}</p>
        <p>3. {{ $t('orderInfo.qryfk') }}</p>
      </div>
    </div>

    <!-- 大图预览 -->
    <Modal v-model="imgModel"
      draggable scrollable
      :closable="false"
      :footer-hide="true">
      <div class="u-text-center">
        <img :src="imgUrl" alt="img" style="max-width: 100%">
      </div>
    </Modal>

    <!-- 我已转账 -->
    <Modal v-model="confirmModel"
      :mask-closable="false"
      draggable scrollable :title="$t('orderInfo.qrzf')"
      :footer-hide="true">
        <div slot="header" class="u-font-20">{{ $t('orderInfo.qrzf') }}</div>
        <div class="u-p-t-20 u-p-b-20">{{ $t('orderInfo.wwczf') }}</div>
        <div class="u-flex u-row-right">
          <Button type="text" @click="confirmModel = false">{{ $t('orderInfo.qx') }}</Button>
          <Button type="primary" :loading="confirmPaymentLoading" @click="confirmPayment">{{ $t('orderInfo.qr') }}</Button>
        </div>
    </Modal>

    <!-- 确认收到转账 -->
    <Modal v-model="receivedModal"
      :mask-closable="false"
      draggable scrollable :title="$t('orderInfo.qrfx')"
      :footer-hide="true">
        <div slot="header" class="u-font-20">{{ $t('orderInfo.qrfx') }}</div>
        <div class="u-p-t-20 u-p-b-20">{{ $t('orderInfo.qwbdl') }}</div>
        <div class="u-flex u-row-right">
          <Button type="text" @click="receivedModal = false">{{ $t('orderInfo.qx') }}</Button>
          <Button type="primary" :loading="confirmCollectionLoading" @click="confirmCollection">{{ $t('orderInfo.qr') }}</Button>
        </div>
    </Modal>

    <!-- 取消订单 -->
    <Modal v-model="cancelModel"
      :mask-closable="false"
      draggable scrollable :title="$t('orderInfo.qxd')"
      :footer-hide="true">
        <div class="title u-font-20" slot="header">{{ $t('orderInfo.qxd') }}</div>
        <div class="cancel-model">
          <div class="init u-flex u-col-top">
            <Icon type="ios-alert" size="20" color="#ed4014"/>
            <div class="u-p-l-6">{{ $t('orderInfo.wfzdtk') }}</div>
          </div>
          <div>
          <div class="u-p-t-20 u-p-b-6">{{ $t('orderInfo.qgsw') }}</div>
          <RadioGroup class="radio-wrap" v-model="cancelReason" vertical>
              <Radio :label="item.value" v-for="(item, index) in cancelList" :key="index">
                <span>{{ item.label }}</span>
              </Radio>
          </RadioGroup>
          </div>
          <div class="u-p-t-20 u-flex u-row-right">
            <Button type="text" @click="cancelModel = false">{{ $t('orderInfo.qx') }}</Button>
            <Button type="primary" @click="confirmCancel" :loading="cancelLoading">{{ $t('orderInfo.qr') }}</Button>
          </div>
        </div>
    </Modal>

    <!-- 申述 -->
    <Modal v-model="showPlead"
      :mask-closable="false"
      draggable scrollable
      :footer-hide="true">
        <div class="title u-font-20" slot="header">申诉</div>
        <Form ref="formPlead" :model="formPlead" :rules="rules" label-position="top">
          <FormItem label="申述理由" prop="type">
            <Select v-model="formPlead.type" placeholder="请选择" v-if="isBuy">
              <Option :value="item.value" v-for="item in buyPleadList" :key="item.value">{{ item.name }}</Option>
            </Select>
            <Select v-model="formPlead.type" placeholder="请选择" v-if="isSell">
              <Option :value="item.value" v-for="item in sellPleadList" :key="item.value">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="联系电话" prop="contactPhone">
            <Input v-model="formPlead.contactPhone"></Input>
          </FormItem>
          <FormItem label="联系人" prop="contactName">
            <Input v-model="formPlead.contactName"></Input>
          </FormItem>
          <FormItem label="申述说明" prop="directions">
            <Input v-model="formPlead.directions" type="textarea"></Input>
          </FormItem>
          <FormItem label="申诉截图（最多上传3张图，上传图片大小不能超过2M）">
            <!-- <Upload
              ref="upload5"
              :before-upload="beforeUpload5"
              :on-success="handHandleSuccess5"
              :headers="uploadHeaders"
              :action="uploadUrl"
              :show-upload-list="false"
              :format="['jpg','jpeg','png']"
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload> -->
            <div class="demo-upload-list u-m-t-10" v-for="item in uploadList" :key="item.uid">
              <template v-if="item.status === 'finished'">
                  <img :src="item.response.data.url">
                  <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info text-inside></Progress>
              </template>
            </div>
            <Upload
              ref="upload5"
              :show-upload-list="false"
              :format="['jpg','jpeg','png']"
              :before-upload="beforeUpload5"
              :on-success="handHandleSuccess5"
              :headers="uploadHeaders"
              :action="uploadUrl"
              type="drag"
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
              </div>
          </Upload>
          </FormItem>

          <div class="u-p-t-20 u-flex u-row-right">
            <Button type="text" @click="showPlead = false">{{ $t('orderInfo.qx') }}</Button>
            <Button type="primary" @click="confirmPlead('formPlead')" :loading="pleadLoading">{{ $t('orderInfo.qr') }}</Button>
          </div>
        </Form>
    </Modal>

    <Modal v-model="viewIimgVisible" footer-hide>
      <img :src="viewIimgUrl" v-if="viewIimgVisible" style="width: 100%">
    </Modal>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import io from 'socket.io-client'
import { getOrderInfo, confirmPayment, cancelOrder, confirmCollection, plead, getHistoryMessage } from '@/api/trade'
import uCountDown from '@/components/u-count-down/u-count-down'
export default {
  components: {
    uCountDown
  },
  data() {
    return {
      messageImgLoading: false,
      uploadHeaders: { 'Authorization': 'Bearer ' + localStorage.token },
      uploadUrl: this.host + process.env.VUE_APP_UPLOAD,
      imgUrl: '',
      imgFile: '',
      message: '',
      messageList: [],
      buyPleadList: [
        { name: '已付款，卖家未放行', value: '已付款，卖家未放行'},
        { name: '向卖家多转了钱', value: '向卖家多转了钱'},
        { name: '卖家涉嫌诈骗', value: '卖家涉嫌诈骗'},
        { name: '其他', value: '其他'},
      ],
      sellPleadList: [
        { name: '没有收到付款', value: '没有收到付款'},
        { name: '没有付款，但金额不符', value: '没有付款，但金额不符'},
        { name: '买家涉嫌诈骗', value: '买家涉嫌诈骗'},
        { name: '其他', value: '其他'},
      ],
      pleadLoading: false,
      viewIimgVisible: false,
      viewIimgUrl: '', // 查看图片
      uploadList: [],
      formPlead: {
        image : ''
      },
      rules: {
        type: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        directions: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
      },
      showPlead: false,
      confirmCollectionLoading: false,
      confirmPaymentLoading: false,
      cancelLoading: false,
      // 取消原因
      cancelReason: '',
      // 取消原因列表
      cancelList: [
        {label: this.$t('orderInfo.wbxjy'), value: '1'},
        {label: this.$t('orderInfo.bmzgg'), value: '2'},
        {label: this.$t('orderInfo.mjyew'), value: '3'},
        {label: this.$t('orderInfo.mjskfsy'), value: '4'},
        {label: this.$t('orderInfo.qt'), value: '5'},
      ],
      // 订单详情
      orderInfo: {
        // 单价
        posterPrice: '',
        // 数量
        settleAccount: '',
        // 总价
        sourceAmount: '',
        // 订单过期时间
        expirationTime: '',
        adName: '',
        kycName: ''
      },
      // 倒计时 毫秒
      timestamp: 0,
      imgModel: false,
      confirmModel: false,
      cancelModel: false,
      orderId: this.$route.params.id,
      receivedModal: false,
      socket: null,
      token: 'Bearer ' + localStorage.token
    }
  },
  async mounted() {
    // 查询订单详情
    await this.getOrderInfo()
    this.initChat()
    this.getHistoryMessage()
  },
  computed: {
    ...mapState(['isLogin', 'userInfo', 'certificationInfo']),
    isBuy() {
      // side - 订单买卖方向；adSide - 1 商家买入、2商家卖出、null 非商家
      if (
        // 买入 or 商家买入 (side == 1 && adSide == null) || (side == 2 && adSide == 1)
        (this.orderInfo.side == 1 && this.orderInfo.adSide == null) ||
        (this.orderInfo.side == 2 && this.orderInfo.adSide == 1)
      ) {
        return true
      } else {
        return false
      }
    },
    isSell() {
      if (
        // 卖出 or 商家卖出 (side == 2 && adSide == null) || (side == 1 && adSide == 2)
        (this.orderInfo.side == 2 && this.orderInfo.adSide == null) ||
        (this.orderInfo.side == 1 && this.orderInfo.adSide == 2)
      ) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    /* 查看图片 */
    handleView(item) {
      this.viewIimgUrl = item.response.data.url
      this.viewIimgVisible = true
    },
    /* 删除图片 */
    handleRemove (file) {
      console.log(file)
      const fileList = this.$refs.upload5.fileList;
      this.$refs.upload5.fileList.splice(fileList.indexOf(file), 1);
    },
    /* 申述图片上传前 */
    beforeUpload5(data) {
      if (data && data.size >= 1024000 * 2) {
        this.$Message.error('上传图片大小不能超过2M')
        return false
      }
      if (this.uploadList.length >= 3) {
        this.$Notice.warning({
          title: '最多上传3张图片'
        });
        return false
      }
    },
    /* 申诉图片上传成功 */
    handHandleSuccess5(res, file, fileList) {
      if (res.code == 0) {
        this.formPlead.image = res.data.url
        this.uploadList = this.$refs.upload5.fileList;
        console.log('uploadList', this.uploadList)
      } else {
        this.$Message.error(res.msg)
      }
    },
    /* 图片上传前 */
    beforeUpload(data) {
      if (data && data.size >= 1024000 * 2) {
        this.$Message.error('上传图片大小不能超过2M')
        return false
      }
      this.messageImgLoading = true
    },
    /* 图片上传成功 */
    handHandleSuccess(res, file, fileList) {
      this.messageImgLoading = false
      console.log('res', res)
      // this.$refs.upload1.fileList = [fileList[fileList.length - 1]]
      if (res.code == 0) {
        // this.chatImgUrl = res.data.url

        let groupRequest = {
            token: this.token,
            roomId: this.orderInfo.id,
            message: res.data.url,
            type: 'IMAGE'
        };
        this.socket.emit('message', groupRequest, () => {
          this.message = ''
          this.scollToBottom()
        });
      } else {
        this.$Message.error(res.msg)
      }
    },
    /* 图片上传失败 */
    onError() {
      this.messageImgLoading = false
    },
    /* 历史聊天记录 */
    getHistoryMessage() {
      getHistoryMessage({
        id: this.orderInfo.id,
        time: new Date().getTime()
      }).then(res => {
        this.messageList = res.reverse()
        console.log(11, JSON.parse(JSON.stringify(this.messageList)))
        this.scollToBottom()
      })
    },
    /* 大图预览 */
    previewImg(val) {
      this.imgUrl = val
      this.imgModel = true
    },
    /* 选择图片 */
    imgChange()  {
      let fileObj = document.getElementById('img_file').files[0]
      let reader = new FileReader()
      // 转成base64
      reader.readAsDataURL(fileObj)
      reader.onload = (e) => {
        let groupRequest = {
            token: this.token,
            roomId: this.orderInfo.id,
            message: e.target.result
        };
        this.socket.emit('message', groupRequest, () => {
          this.message = ''
          this.scollToBottom()
        });
      }
    },
    /* 连接聊天室 */
    initChat() {
      let url = `${process.env.VUE_APP_OTC_WS}/otc?Authorization=` + this.token;
      this.socket = io.connect(url);
      this.socket.on('connect', function () {
        console.log('连接成功')
      });

      // 加入聊天
      let joinRequest = {
          token: this.token,
          roomId: this.orderInfo.id

      }
      this.socket.emit('join_room', joinRequest, function(data) {
        console.log('加入成功')
      });

      // 插入聊天消息
      this.socket.on('message', (data) => {
        this.messageImgLoading = false
        this.messageList.push(data)
        this.scollToBottom()
        if (data.type == 'SYSTEM') {
          this.getOrderInfo()
        }
      });

      // socket.on('disconnect', function () {
      //   console.log('断开连接')
      //     // output("<span class=disconnect-msg>系统通知: " + token + "已从websocket服务器断开连接</span>", null);
      // });
    },
    sendMessages() {
      console.log('回车', this.token)
      if (this.message === '') {
        return;
      }
      
      // 发送消息
      let groupRequest = {
          token: this.token,
          roomId: this.orderInfo.id,
          message: this.message,
          type: 'TEXT'
      };
      this.messageImgLoading = true
      this.socket.emit('message', groupRequest, () => {
        this.message = ''
      });
    },
    /* 滚动到底部 */
    scollToBottom() {
      setTimeout(() => {
        this.$nextTick(() => {
          let chat = document.getElementById('chat_content')
          chat.scrollTop = chat.scrollHeight
        })
      }, 200)
    },
    /* 断开连接 */
    sendDisconnect() {
      this.socket.disconnect();
    },
    /* 申述 */
    confirmPlead(name) {
      console.log(JSON.parse(JSON.stringify(this.formPlead)))
      // return 
      this.$refs[name].validate((valid) => {
        if (valid) {
          plead({
            ...this.formPlead,
            tradeId: this.orderInfo.id,
            action: this.isBuy ? 0 : 1
          }).then(() => {
            this.$Notice.success({
              title: '提示',
              desc: "申诉成功"
            })
            this.showPlead = false
            this.getOrderInfo()
          })
        } 
    })
    },
    /* 取消订单 */
    confirmCancel() {
      if (this.cancelReason == '') {
        this.$Notice.info({
          title: this.$t('publice.ts'),
          desc: this.$t('orderInfo.qxzqx')
        })
        return 
      }
      this.cancelLoading = true
      cancelOrder({
        orderId: this.orderId,
        cancelType: this.cancelReason,
        userId: this.userInfo.uuid
      }).then(() => {
        this.$Notice.success({
          title: this.$t('publice.ts'),
          desc: this.$t('orderInfo.ddqxcg')
        })
        this.cancelModel = false
        this.getOrderInfo()
      }).finally(() => {
        this.cancelLoading = false
      })
    },
    /* 我已收到转账，下一步 */
    confirmCollection() {
      this.confirmCollectionLoading = true
      confirmCollection({
        userId: this.userInfo.uuid,
        orderId: this.orderId,
        // emailCode: '123123',
        // mobileCode: '123123',
      }).then(() => {
        this.$Notice.success({
          title: this.$t('publice.ts'),
          desc: this.$t('publice.cg'),
        })
        this.receivedModal = false
        this.getOrderInfo()
      }).finally(() => {
        this.confirmCollectionLoading = false
      })
    },
    /* 我已转账，下一步 */
    confirmPayment() {
      this.confirmPaymentLoading = true
      confirmPayment({
        userId: this.userInfo.uuid,
        orderId: this.orderId,
        paymentId: this.orderInfo.paymentList ? this.orderInfo.paymentList[0].paymentId : this.orderInfo.paymentId,
      }).then(() => {
        this.$Notice.success({
          title: this.$t('publice.ts'),
          desc: this.$t('publice.cg'),
        })
        this.confirmModel = false
        this.getOrderInfo()
      }).finally(() => {
        this.confirmPaymentLoading = false
      })
    },
    /* 倒计时结束 */
    countDownEnd() {
      this.orderInfo.status = 0
    },
    /* 查询订单详情 */
    getOrderInfo() {
      return new Promise(resolve => {
        getOrderInfo({
          id: this.orderId
        }).then(res => {
          this.orderInfo = res
  
          this.timestamp = (this.orderInfo.expirationTime - new Date().getTime()) / 1000
          console.log(this.timestamp)
          resolve()
        })
      })
    },

  },
  destroyed() {
    this.sendDisconnect()
  }
}
</script>

<style lang="scss" scoped>
// 上传申诉图
.demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
.demo-upload-list img{
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
    display: block;
}
.demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
// 聊天室头像
.avatar {
  width: 38px;
  height: 38px;
  text-align: center;
  line-height: 38px;
  border-radius: 64px;
  background-color: #007aff;
  em {
    font-style: normal;
    color: #fff;
  }
}
.cancel-model {
  .init {
    padding: 12px 16px;
    border-radius: 4px;
    background: #fff5f5;
    border: 1px solid #ffb3b8;
  }
}
.radio-wrap {
  width: 100%;
  border: 1px solid #eee;
  border-radius: 4px;
  .ivu-radio-wrapper {
    width: 100%;
    padding: 0 16px;
    border-bottom: 1px solid #eee;
    margin-right: 0;
  }
}

::v-deep .ivu-modal-footer {
  border-top: none;
}
.wrap {
  background-color: #F2F6FD;
  .content-wrap {
    padding: 50px 0;
    .content {
      .left{
        background-color: #FFF;
        border-radius: 8px;
      }
      .right {
        display: flex;
        flex-direction: column;
        background-color: #FFF;
        border-radius: 8px;
        .r-top {
          border-bottom: 1px solid #eee;
        }
        .r-con {
          flex: 1;
        }
        .chat-content {
          height: 388px;
          overflow: auto;
          padding: 0 10px 10px;
          .system {
            text-align: center;
          }
          .chat-left {
            p {
              display: inline-block;
              padding: 10px;
              border-radius: 8px;
              color: #495666;
              background-color: #f1f3ff;
              max-width: 100%;
              word-break: break-word;
            }
          }
          .chat-right {
            .text {
              display: flex;
              justify-content: flex-end;
              margin-top: 10px;
            }
            .img-wrap {
              text-align: right;
            }
            p {
              display: inline-block;
              padding: 10px;
              border-radius: 8px;
              color: #495666;
              background-color: #d1e7ff;
              max-width: 100%;
              word-break: break-word;
            }
          }
        }
        .bot-wrap {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          ::v-deep textarea {
            resize: none;
          }
        }
      }
    }
    .info {
      .init {
        padding: 10px;
        border-radius: 4px;
        color: #f90;
        background: rgba(250,173,20,.05);
        border: 1px solid rgba(250,173,20,.3);
      }
      .icon-btn {
        min-width: 58px;
        text-align: center;
        background-color: rgb(250, 250, 250);
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 12px;
      }
    }
  }
  .bot-info {
    width: 1200px;
    margin: 0 auto;
    p {
      line-height: 28px;
    }
  }
}
.img-btn {
  border: none;
  font-size: 20px;
  ::v-deep i {
    color: #9aa5b5;
  }
}
.price-info {
  display: flex;
}
.order-cancel {
  min-height: 100px;
  text-align: center;
  font-size: 16px;
}
@media (min-width: 768px) {
  .content {
    width: 1200px;
    margin: 0 auto;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    min-height: 465px;
    .left{
      flex: 1;
    }
    .right {
      width: 340px;
      margin-left: 20px;
    }
  }
}
@media (max-width: 767px) {
  ::v-deep .ivu-modal-content {
    width: auto !important;
  }
  .wrap {
    .content-wrap {
      padding-top: 10px;
      .content {
        width: 100%;
        .right {
          margin-top: 20px;
        }
      }
    }
  }
  .wrap .bot-info {
    width: 100%;
    padding: 0 10px;
  }
  .price-info {
    display: block;
    .item {
      display: flex;
      justify-content: space-between;
      padding-right: 0 !important;
    }
  }
}
</style>