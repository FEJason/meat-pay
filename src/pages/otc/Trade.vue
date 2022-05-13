<template>
  <div class="content">
    <div class="tab-wrap">
      <div class="p-flex">
        <!-- 购买、出售切换 -->
        <div class="buy-sell-wrap u-flex">
          <router-link
            :to="'/otc/trade/buy-' + coinActive"
            class="buy-btn btn"
            :class="{ on: buyOrSell == 'buy' }"
            >{{ $t('trade.buy') }}</router-link
          >
          <router-link
            :to="'/otc/trade/sell-' + coinActive"
            class="sell-btn btn"
            :class="{ on: buyOrSell == 'sell' }"
            >{{ $t('trade.sell') }}</router-link
          >
        </div>
        <!-- 币种列表 - 点击跳转路由 -->
        <div class="coin-wrap">
          <router-link
            v-for="(item, index) in coins"
            :key="index"
            :to="`/otc/trade/${buyOrSell}-` + item.currency.toLowerCase()"
            class="u-m-l-32 u-font-16 coin-btn"
            :class="{
              on: item.currency == coinActive.toUpperCase(),
              'on-sell':
                item.currency == coinActive.toUpperCase() && buyOrSell == 'sell'
            }"
            >{{ item.currency }}</router-link
          >
        </div>
      </div>

      <!-- <div class="u-p-r-12">
        <a href="javascript:void(0)" @click="goBusiness" class="u-font-14">
          <Icon type="ios-contact" color="#007AFF" size="16"/>
          {{ $t('trade.cwsj') }}
        </a>
        <Button class="u-m-l-10" type="success" @click="clickRelease">{{ $t('trade.fbwtd') }}</Button>
      </div> -->
    </div>

    <div class="table-wrap">
      <div class="table-con">
        <!-- PC-筛选模块 -->
        <div class="screen-wrap hidden-xs u-flex u-row-between">
          <div class="u-font-16 u-font-bold" style="color: #666">
            {{ $t('trade.zxjy') }}
          </div>
          <div class="u-flex">
            <Select
              :value="currentCurrency"
              style="width: 120px"
              filterable
              @on-change="changeCurrency"
            >
              <!-- <Avatar :src="currentImg" slot="prefix" size="small" /> -->
              <img :src="currentImg" alt="ico" slot="prefix"  style="width: 18px; height: 18px;" />
              <Option
                v-for="item in legalList"
                :label="item.fiatCurrency"
                :value="item.fiatCurrency"
                :key="item.fiatCurrency"
                >
                <!-- {{ item.fiatCurrency }} -->
                <div class="u-flex">
                  <img :src="item.imageUrl" alt="" style="width: 18px; height: 18px;">
                  <span class="u-p-l-10">{{ item.fiatCurrency }}</span>
                </div>
              </Option
              >
            </Select>
            <!-- 金额筛选 -->
            <!-- <div class="u-p-l-12 hidden-xs">
              <Input
                search
                :enter-button="$t('trade.confirm')"
                :placeholder="$t('trade.qsrje')"
                v-model="tradeAmount"
                @on-search="searchAmount"
                @input.native="
                  () => {
                    tradeAmount = tradeAmount.replace(
                      /^\D*(\d*(?:\.\d{0,8})?).*$/g,
                      '$1'
                    )
                  }
                "
              />
            </div> -->
            <!-- 支付方式筛选 -->
            <Select
              class="u-p-l-12"
              :value="currentPay"
              style="width: 140px"
              @on-change="changePay"
            >
              <Option
                v-for="item in payList"
                :label="item.payTypeName"
                :value="item.payTypeId"
                :key="item.payTypeId"
                >{{ item.payTypeName }}</Option
              >
            </Select>
            
            <Dropdown trigger="click" @on-click="clickRefresh">
              <Button icon="md-refresh" class="u-m-l-10" :loading="refreshLoading">{{ refreshText }}</Button>
              <DropdownMenu slot="list">
                <DropdownItem name="0" v-text="$t('trade.zbcl')">暂不处理</DropdownItem>
                <DropdownItem name="5" v-text="$t('trade.zdsx5')">5秒自动刷新</DropdownItem>
                <DropdownItem name="10" v-text="$t('trade.zdsx10')">10秒自动刷新</DropdownItem>
                <DropdownItem name="20" v-text="$t('trade.zdsx20')">20秒自动刷新</DropdownItem>
              </DropdownMenu>
          </Dropdown>
          </div>
        </div>

        <!-- PC-买卖列表 -->
        <div class="adv-list-wrap hidden-xs u-p-b-20">
          <!-- 手写表格 -->
          <div>
            <div class="table-title u-flex u-font-12">
              <span class="column width0">{{ $t('trade.ggf') }}</span>
              <span class="column width1">{{ $t('trade.price') }}</span>
              <span class="column width2">{{ $t('trade.slxe') }}</span>
              <span class="column width3">{{ $t('trade.zffs') }}</span>
              <span class="column width4 u-text-right">{{
                $t('trade.jy')
              }}</span>
            </div>
            <div class="table-list u-font-14 u-m-b-20">
              <div
                class="item-wrap"
                v-for="row in advertiment.ask.rows"
                :key="row.adId"
              >
                <div class="item u-flex" v-if="!row.modalShow">
                  <div class="column width0">
                    <div class="u-font-14 u-flex">
                      <div class="avatar u-m-r-10 u-font-bold">
                        <em>{{row.adName.substring(0, 1).toUpperCase()}}</em>
                      </div>
                      <div>
                        <div class="u-font-bold">{{ row.adName }}</div>
                        <div class="u-font-12" style="color: #495666">{{$t('trade.cdl')}}: {{ `${row.volume} | 99%`}}</div>
                      </div>
                      
                    </div>
                  </div>
                  <div class="column width1 pay-font width1 u-font-18" style="color: #00c096">
                    {{ toFixeds(row.posterPrice, currencyScale) }}
                    {{ row.fiatCurrency }}
                  </div>
                  <div class="column width2">
                    <div>
                      <span class="u-p-r-12" style="color: #9aa5b5">{{
                        $t('trade.number')
                      }}</span>
                      <span style="color: #1c242c"
                        >{{ toFixeds(row.balance, coinActiveScale) }}
                        {{ row.currencyName }}</span
                      >
                    </div>
                    <div>
                      <span class="u-p-r-12" style="color: #9aa5b5">{{
                        $t('trade.xe')
                      }}</span>
                      <span style="color: #1c242c"
                        >{{ toFixeds(row.minOrderAmt) }} -
                        {{ toFixeds(row.maxOrderAmt) }}
                        {{ row.fiatCurrency }}</span
                      >
                    </div>
                  </div>
                  <div class="column width3 u-font-12">
                    <div class="u-flex u-flex-wrap" v-if="buyOrSell == 'buy'">
                      <span
                        v-for="(item, index) in row.paymentList"
                        :key="index"
                        :style="{color: item.payTypeId == 4 ? '#1bb1f3' : item.payTypeId == 3 ? '#42c71b' : '#f1bc15'}"
                        class="pay-btn"
                        >{{ item.payTypeName }}</span
                      >
                    </div>
                    <div class="u-flex u-flex-wrap" v-if="buyOrSell == 'sell'">
                      <span
                        v-for="(item, index) in row.payTypeList"
                        :key="index"
                        :style="{color: item.payTypeId == 4 ? '#1bb1f3' : item.payTypeId == 3 ? '#42c71b' : '#f1bc15'}"
                        class="pay-btn"
                        >{{ item.payTypeName }}</span
                      >
                    </div>
                  </div>
                  <div class="column width4 u-text-right">
                    <Button
                      type="primary"
                      v-if="buyOrSell == 'buy'"
                      @click="openTradeInfo(row)"
                      >{{ $t('trade.buy') }}
                      {{ coinActive.toUpperCase() }}</Button
                    >
                    <Button type="primary" v-else @click="openTradeInfo(row)"
                      >{{ $t('trade.sell') }}
                      {{ coinActive.toUpperCase() }}</Button
                    >
                  </div>
                </div>
                <div v-else>
                  <div class="modal-wrap u-flex u-col-top u-row-between">
                    <div class="modal-left u-p-r-16 u-flex-1">
                      <div class="u-font-bold u-p-b-16 u-font-16">
                        {{ advInfo.adName }} (8888 | 88%)
                      </div>
                      <div class="u-p-b-10">
                        Mtea {{ $t('trade.rzyh') }} 8888-USDT
                      </div>
                      <div class="auth u-flex">
                        <div>
                          <Icon type="ios-checkmark-circle" size="16" />{{
                            $t('trade.email')
                          }}
                        </div>
                        <div>
                          <Icon type="ios-checkmark-circle" size="16" />{{
                            $t('trade.phone')
                          }}
                        </div>
                        <div>
                          <Icon type="ios-checkmark-circle" size="16" />{{
                            $t('trade.sm')
                          }}
                        </div>
                        <div>
                          <Icon type="ios-checkmark-circle" size="16" />{{
                            $t('trade.gj')
                          }}
                        </div>
                      </div>
                      <!-- 广告说明 -->
                      <div>{{ advInfo.directions }}</div>
                    </div>
                    <div class="modal-right u-flex-1">
                      <div class="top u-flex">
                        <!-- 数量 -->
                        <div class="u-p-r-26">
                          <div class="u-p-b-10">{{ $t('trade.number') }}</div>
                          <div>{{ advInfo.account }} {{ advInfo.currencyName }}</div>
                        </div>
                        <!-- 限额 -->
                        <div class="u-p-r-26">
                          <div class="u-p-b-10">{{ $t('trade.xe') }}</div>
                          <div>
                            {{ $yj.transMoney(advInfo.minOrderAmt) }}-{{ $yj.transMoney(advInfo.maxOrderAmt) }}
                            {{ advInfo.fiatCurrency }}
                          </div>
                        </div>
                        <!-- 单价 -->
                        <div class="u-p-r-26">
                          <div class="u-p-b-10">{{ $t('trade.price') }}</div>
                          <div class="u-font-bold pay-font" :style="{color: buyOrSell == 'buy' ? '#19be6b' : '#ff5f67'}">
                            {{ $yj.transMoney(advInfo.posterPrice) }}
                            {{ advInfo.fiatCurrency }}
                          </div>
                        </div>
                      </div>
                      <div class="bot">
                        <Form
                          ref="formInline"
                          :model="formInline"
                          :rules="ruleInline"
                        >
                          <div class="u-flex u-col-top">
                            <FormItem
                              prop="totalPrice"
                              class="u-flex-1"
                              style="margin-right: 0"
                            >
                              <div>{{ $t('trade.zj') }}</div>
                              <div class="u-relative">
                                <Input
                                  type="text"
                                  v-model="formInline.totalPrice"
                                  @input.native="totalPriceInput"
                                >
                                  <!-- <div slot="append">{{ advInfo.fiatCurrency }}</div> -->
                                </Input>
                                <div class="abs-right">
                                  <!-- <span class="all">全部</span> -->
                                  <span class="u-p-l-6">{{ advInfo.fiatCurrency }}</span>
                                </div>
                              </div>
                            </FormItem>
                            <div
                              class="u-text-center"
                              style="width: 80px; padding-top: 36px"
                            >
                              <Icon type="md-swap" size="26" color="#b7b7b7" />
                            </div>
                            <FormItem
                              prop="num"
                              class="u-flex-1"
                              style="margin-right: 0"
                            >
                              <div>{{ $t('trade.number') }}</div>
                              <div class="u-relative">
                                <Input
                                  type="text"
                                  v-model="formInline.num"
                                  @input.native="numInput"
                                >
                                </Input>
                                <div class="abs-right">
                                  <!-- <span class="all">全部</span> -->
                                  <span class="u-p-l-6">{{ advInfo.currencyName }}</span>
                                </div>
                              </div>
                            </FormItem>
                          </div>
                          <div class="u-m-b-20" v-if="buyOrSell == 'sell'">
                            <div class="u-p-b-8">支付方式</div>
                            <Button long type="primary" ghost
                              to="/set-payment"
                              v-if="paymentList.length == 0">设置支付方式</Button>
                            
                            <FormItem
                              prop="paymentId"
                              v-else
                            >
                              <Select
                                width="100%"
                                v-model="formInline.paymentId"
                                multiple
                                :placeholder="$t('publice.qxz')"
                              >
                                <Option
                                  v-for="item in paymentList"
                                  :value="item.id"
                                  :key="item.id"
                                >
                                  {{
                                    item.payTypeId == 4
                                      ? $t('trade.zfb')
                                      : item.payTypeId == 3
                                      ? $t('trade.wx')
                                      : $t('trade.yhk')
                                  }}
                                  - {{ item.accountName }} {{ item.account }}
                                </Option>
                              </Select>
                            </FormItem>
                          </div>
                        </Form>
                        <div class="u-p-b-10 u-font-12">*{{ $t('trade.mffk') }}</div>
                        <div class="u-font-12">
                          *{{ $t('trade.wbhnd')
                          }}<span style="color: #007aff"
                            >T+1{{ $t('trade.tbxz') }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 买卖弹窗 -->
          <Modal
            v-model="modalShow"
            width="1200px"
            title=""
            :mask-closable="false"
            :footer-hide="true"
          >
            <div class="modal-wrap u-flex u-col-top u-row-between">
              <div class="modal-left u-p-r-16 u-flex-1">
                <div class="u-font-bold u-p-b-16 u-font-16">
                  {{ advInfo.adName }} (8888 | 88%)
                </div>
                <div class="u-p-b-10">
                  Mtea {{ $t('trade.rzyh') }} 8888-USDT
                </div>
                <div class="auth u-flex">
                  <div>
                    <Icon type="ios-checkmark-circle" size="16" />{{
                      $t('trade.email')
                    }}
                  </div>
                  <div>
                    <Icon type="ios-checkmark-circle" size="16" />{{
                      $t('trade.phone')
                    }}
                  </div>
                  <div>
                    <Icon type="ios-checkmark-circle" size="16" />{{
                      $t('trade.sm')
                    }}
                  </div>
                  <div>
                    <Icon type="ios-checkmark-circle" size="16" />{{
                      $t('trade.gj')
                    }}
                  </div>
                </div>
                <!-- 广告说明 -->
                <div>{{ advInfo.directions }}</div>
              </div>
              <div class="modal-right u-flex-1">
                <div class="top u-flex">
                  <!-- 数量 -->
                  <div class="u-p-r-26">
                    <div class="u-p-b-10">{{ $t('trade.number') }}</div>
                    <div>{{ advInfo.balance }} {{ advInfo.currencyName }}</div>
                  </div>
                  <!-- 限额 -->
                  <div class="u-p-r-26">
                    <div class="u-p-b-10">{{ $t('trade.xe') }}</div>
                    <div>
                      {{ $yj.transMoney(advInfo.minOrderAmt) }}-{{ $yj.transMoney(advInfo.maxOrderAmt) }}
                      {{ advInfo.fiatCurrency }}
                    </div>
                  </div>
                  <!-- 单价 -->
                  <div class="u-p-r-26">
                    <div class="u-p-b-10">{{ $t('trade.price') }}</div>
                    <div class="u-font-bold pay-font" :style="{color: buyOrSell == 'buy' ? '#19be6b' : '#ff5f67'}">
                      {{ $yj.transMoney(advInfo.posterPrice) }}
                      {{ advInfo.fiatCurrency }}
                    </div>
                  </div>
                </div>
                <div class="bot">
                  <Form
                    ref="formInline"
                    :model="formInline"
                    :rules="ruleInline"
                  >
                    <div class="u-flex u-col-top">
                      <FormItem
                        prop="totalPrice"
                        class="u-flex-1"
                        style="margin-right: 0"
                      >
                        <div>{{ $t('trade.zj') }}</div>
                        <div class="u-relative">
                          <Input
                            type="text"
                            v-model="formInline.totalPrice"
                            @input.native="totalPriceInput"
                          >
                            <!-- <div slot="append">{{ advInfo.fiatCurrency }}</div> -->
                          </Input>
                          <div class="abs-right">
                            <!-- <span class="all">全部</span> -->
                            <span class="u-p-l-6">{{ advInfo.fiatCurrency }}</span>
                          </div>
                        </div>
                      </FormItem>
                      <div
                        class="u-text-center"
                        style="width: 80px; padding-top: 36px"
                      >
                        <Icon type="md-swap" size="26" color="#b7b7b7" />
                      </div>
                      <FormItem
                        prop="num"
                        class="u-flex-1"
                        style="margin-right: 0"
                      >
                        <div>{{ $t('trade.number') }}</div>
                        <div class="u-relative">
                          <Input
                            type="text"
                            v-model="formInline.num"
                            @input.native="numInput"
                          >
                          </Input>
                          <div class="abs-right">
                            <!-- <span class="all">全部</span> -->
                            <span class="u-p-l-6">{{ advInfo.currencyName }}</span>
                          </div>
                        </div>
                      </FormItem>
                    </div>
                    <div class="u-m-b-20" v-if="buyOrSell == 'sell'">
                      <div class="u-p-b-8">支付方式</div>
                      <Button long type="primary" ghost
                        to="/set-payment"
                        v-if="paymentList.length == 0">设置支付方式</Button>
                      
                      <FormItem
                        prop="paymentId"
                        v-else
                      >
                        <Select
                          width="100%"
                          v-model="formInline.paymentId"
                          multiple
                          :placeholder="$t('publice.qxz')"
                        >
                          <Option
                            v-for="item in paymentList"
                            :value="item.id"
                            :key="item.id"
                          >
                            {{
                              item.payTypeId == 4
                                ? $t('trade.zfb')
                                : item.payTypeId == 3
                                ? $t('trade.wx')
                                : $t('trade.yhk')
                            }}
                            - {{ item.accountName }} {{ item.account }}
                          </Option>
                        </Select>
                      </FormItem>
                    </div>
                  </Form>
                  <div class="u-p-b-10 u-font-12">*{{ $t('trade.mffk') }}</div>
                  <div class="u-font-12">
                    *{{ $t('trade.wbhnd')
                    }}<span style="color: #007aff"
                      >T+1{{ $t('trade.tbxz') }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="u-text-right u-p-20">
              <Button
                type="text"
                @click="modalShow = false"
                style="width: 100px"
                >{{ $t('trade.cancel') }}</Button
              >
              <Button
                type="primary"
                :loading="formInline.disabled"
                @click="submitOrder('formInline')"
                style="width: 100px"
                >{{ $t('trade.xd') }}</Button
              >
            </div>
          </Modal>

        </div>

        <!-- 移动端-买卖列表 -->
        <div class="xs-list-wrap hidden-lg">
          <div
            class="card"
            v-for="(row, index) in advertiment.ask.rows"
            :key="index"
            >
            <div class="head">
              <!-- <div>头像</div> -->
              <div class="bot-border">
                <h2 style="color: #1c242c">{{ row.adName }}</h2>
                <p>成单量：666 | 99%</p>
              </div>
            </div>
            <div class="list-line"></div>
            <div class="con">
              <div class="u-m-b-14 u-flex" v-if="buyOrSell == 'buy'">
                <span
                  v-for="(item, index) in row.paymentList"
                  :key="index"
                  :style="{color: item.payTypeId == 4 ? '#1bb1f3' : item.payTypeId == 3 ? '#42c71b' : '#f1bc15'}"
                  class="pay-btn"
                  >{{ item.payTypeName }}</span
                >
              </div>
              <div class="u-m-b-14 u-flex" v-if="buyOrSell == 'sell'">
                <span
                  v-for="(item, index) in row.payTypeList"
                  :key="index"
                  :style="{color: item.payTypeId == 4 ? '#1bb1f3' : item.payTypeId == 3 ? '#42c71b' : '#f1bc15'}"
                  class="pay-btn"
                  >{{ item.payTypeName }}</span
                >
              </div>

              <div>
                <span class="u-p-r-12" style="color: #6e7a89">{{
                  $t('trade.number')
                }}</span>
                <span style="color: #1c242c; font-weight: 700;"
                  >{{ toFixeds(row.balance, coinActiveScale) }}
                  {{ row.currencyName }}</span
                >
              </div>
              <div>
                <span class="u-p-r-12" style="color: #6e7a89">{{
                  $t('trade.xe')
                }}</span>
                <span style="color: #1c242c; font-weight: 700;"
                  >{{ toFixeds(row.minOrderAmt) }} -
                  {{ toFixeds(row.maxOrderAmt) }}
                  {{ row.fiatCurrency }}</span
                >
              </div>
              <div class="u-flex u-row-between">
                <div>
                  <span>{{ $t('trade.price') }}</span>
                  <span class="column pay-font width1 u-font-18" style="color: #00c096;">
                    {{ toFixeds(row.posterPrice, currencyScale) }}
                    {{ row.fiatCurrency }}
                  </span>
                </div>
                <div>
                  <Button
                    type="primary"
                    v-if="buyOrSell == 'buy'"
                    @click="openTradeInfo(row, 'mobile')"
                    >{{ $t('trade.buy') }}
                    {{ coinActive.toUpperCase() }}</Button
                  >
                  <Button type="primary" v-else @click="openTradeInfo(row, 'mobile')"
                    >{{ $t('trade.sell') }}
                    {{ coinActive.toUpperCase() }}</Button
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- 移动端弹窗 -->
          <van-popup v-model="popShow" position="bottom" closeable>
            <div class="xs-pop-wrap">
              <h2 class="title">
                {{ buyOrSell == 'buy'? $t('trade.buy') : $t('trade.sell')}}
                {{ advInfo.currencyName }}
              </h2>
              <div class="u-font-bold u-p-t-28 u-p-b-16 u-font-16">
                {{ advInfo.adName }} (8888 | 88%)
              </div>
              <!-- 单价 -->
              <div class="u-flex u-font-16">
                <div class="u-p-r-10">{{ $t('trade.price') }}</div>
                <div class="u-font-bold pay-font" :style="{color: buyOrSell == 'buy' ? '#19be6b' : '#ff5f67'}">
                  {{ $yj.transMoney(advInfo.posterPrice) }}
                  {{ advInfo.fiatCurrency }}
                </div>
              </div>
              <!-- 限额 -->
              <div class="u-flex u-font-16">
                <div class="u-p-r-10">{{ $t('trade.xe') }}</div>
                <div>
                  {{ $yj.transMoney(advInfo.minOrderAmt) }} -
                  {{ $yj.transMoney(advInfo.maxOrderAmt) }}
                  {{ advInfo.fiatCurrency }}
                </div>
              </div>
              <!-- 数量 -->
              <div class="u-flex u-font-16 u-m-b-30">
                <div class="u-p-r-10">{{ $t('trade.number') }}</div>
                <div>{{ advInfo.balance }} {{ advInfo.currencyName }}</div>
              </div>
              <Form
                ref="formInline2"
                :model="formInline"
                :rules="ruleInline"
                class="u-col-top"
              >
                <FormItem
                  prop="totalPrice"
                  style="margin-right: 0"
                >
                  <div>{{ $t('trade.zj') }}</div>
                  <div class="u-relative">
                    <Input
                      size="large"
                      type="text"
                      v-model="formInline.totalPrice"
                      @input.native="totalPriceInput"
                    >
                    </Input>
                    <div class="abs-right u-p-t-2">
                      <span class="u-p-l-6">{{ advInfo.fiatCurrency }}</span>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  prop="num"
                  style="margin-right: 0"
                >
                  <div>{{ $t('trade.number') }}</div>
                  <div class="u-relative">
                    <Input
                      size="large"
                      type="text"
                      v-model="formInline.num"
                      @input.native="numInput"
                    >
                    </Input>
                    <div class="abs-right u-p-t-2">
                      <!-- <span class="all">全部</span> -->
                      <span class="u-p-l-6">{{ advInfo.currencyName }}</span>
                    </div>
                  </div>
                </FormItem>
                <div class="u-m-b-20" v-if="buyOrSell == 'sell'">
                  <div class="u-p-b-8 u-font-14">支付方式</div>
                  <Button long type="primary" ghost
                    to="/set-payment"
                    v-if="paymentList.length == 0">设置支付方式</Button>
                  
                  <FormItem
                    prop="paymentId"
                    v-else
                  >
                    <Select
                      size="large"
                      width="100%"
                      v-model="formInline.paymentId"
                      multiple
                      :placeholder="$t('publice.qxz')"
                    >
                      <Option
                        v-for="item in paymentList"
                        :value="item.id"
                        :key="item.id"
                      >
                        {{
                          item.payTypeId == 4
                            ? $t('trade.zfb')
                            : item.payTypeId == 3
                            ? $t('trade.wx')
                            : $t('trade.yhk')
                        }}
                        - {{ item.accountName }} {{ item.account }}
                      </Option>
                    </Select>
                  </FormItem>
                </div>
              </Form>

              <Button
                size="large"
                long
                type="primary"
                :loading="formInline.disabled"
                @click="submitOrder('formInline2')"
                >{{ $t('trade.xd') }}</Button
              >

              <div class="u-m-t-30">
                <h2 class="u-p-b-10">交易条款</h2>
                <div>{{ advInfo.directions }}</div>
              </div>
            </div>
          </van-popup>
        </div>

        <!-- 分页 -->
        <div class="u-text-center u-p-b-40">
          <Page
            v-if="pages.total > 0"
            :pageSize="pages.size"
            :total="pages.total"
            :current="pages.current"
            @on-change="changePage"
          ></Page>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import {
  getCurrencyList,
  getLegalList,
  getAdList,
  release,
  setRelease,
  getIdAdv,
  otcOrder,
  queryPayWay
} from '@/api/trade'
import { getPaymentList } from '@/api/user'
import yjuiSelect from '@/components/yjui-select/yjui-select'
export default {
  components: {
    yjuiSelect
  },
  data() {
    // 总价效验
    const validateTotalPrice = (rule, value, callback) => {
      let minOrderAmt = parseFloat(this.advInfo.minOrderAmt)
      let maxOrderAmt = parseFloat(this.advInfo.maxOrderAmt)
      if (value == '' || value == undefined) {
        callback(new Error('总价不能为空'))
      } else if (parseFloat(value) < minOrderAmt) {
        // 最小下单金额为
        callback(
          new Error(
            '最小下单金额为' + this.$yj.transMoney(this.advInfo.minOrderAmt)
          )
        )
      } else if (parseFloat(value) > maxOrderAmt) {
        // 最大下单金额为
        callback(
          new Error(
            '最大下单金额为' + this.$yj.transMoney(this.advInfo.maxOrderAmt)
          )
        )
      } else {
        callback()
      }
    }
    // 数量效验
    const validateNum = (rule, value, callback) => {
      let maxNum = parseFloat(this.advInfo.account)
      if (value == '' || value == undefined) {
        callback(new Error('数量不能为空'))
      } else if (parseFloat(value) > maxNum) {
        // 最大下单数量为
        callback(new Error('最大下单数量为' + this.advInfo.account))
      } else {
        callback()
      }
    }
    const validatePaymentId = (rule, value, callback) => {
      console.log(value)
      if (value == '' || value == undefined) {
        callback(new Error('请选择支付方式'))
      } else {
        callback()
      }
    }
    
    return {
      VUE_APP_WS: process.env.VUE_APP_WS,
      popShow: false,
      modalShow: false,
      marketNo: '',
      tradeId: '',
      // 广告详情
      advInfo: {
        // 广告商名称
        adName: '广告商名称',
        // 币种名称
        currencyName: 'USDT',
        // 法币token 如CNY
        fiatCurrency: 'CNY',
        // 用户交易价格（加幅之后的价格）
        posterPrice: 5.05,
        // 单笔最低购买金额
        minOrderAmt: 10,
        // 单笔最高金额
        maxOrderAmt: 10000,
        // 金额精度（小数点数量）
        scale: 2
      },
      formInline: {
        totalPrice: '',
        num: '',
        paymentId: []
      },
      ruleInline: {
        totalPrice: [{ validator: validateTotalPrice, trigger: 'change' }],
        num: [{ validator: validateNum, trigger: 'change' }],
        paymentId: [
          { validator: validatePaymentId, trigger: 'change' }
        ]
      },

      tradeAmount: '', // 金额
      submitLoad: false,
      paymentList: [], // 收款列表
      releaseForm: {
        side: '1'
      },
      rules: {
        side: [
          { required: true, message: '请选择广告类型', trigger: 'change' }
        ],
        currencyId: [{ required: true, message: '请选择', trigger: 'change' }],
        fiatId: [{ required: true, message: '请选择', trigger: 'change' }],
        posterPrice: [{ required: true, message: '请输入', trigger: 'blur' }],
        account: [{ required: true, message: '请输入', trigger: 'blur' }],
        minOrderAmt: [{ required: true, message: '请输入', trigger: 'blur' }],
        maxOrderAmt: [{ required: true, message: '请输入', trigger: 'blur' }],
        paymentIds: [
          {
            required: true,
            type: 'array',
            message: '请选择',
            trigger: 'change'
          }
        ]
      },
      currentCurrency: 'CNY', // 当前币种
      currentImg: 'https://sosolx-prod.oss-cn-shenzhen.aliyuncs.com/currency/CNY.png', // 当前币种图片
      notFountPay: false,
      currentPay: -1, // 选择支付方式
      payList: [],
      // 法币列表
      legalList: [],
      // 币种列表
      coins: [{ currency: 'USDT' }, { currency: 'BTC' }, { currency: 'ETH' }],
      // 默认币种
      coinActive: 'usdt',
      buyOrSell: 'buy',

      // 币种小数位
      coinActiveScale: 4,
      // 法币小数位
      currencyScale: 2,

      tableLoading: false,
      advertiment: {
        //卖出的广告数据
        ask: {
          rows: [],
          currentPage: 1,
          totalPage: 1,
          pageNumber: 10,
          totalElement: 0
        }
        //买入的广告数据
        // bid: {
        //   rows: [],
        //   currentPage: 1,
        //   totalPage: 1,
        //   pageNumber: 10,
        //   totalElement: 0,
        // },
      },
      refreshText: this.$t('trade.sxsz'),
      refreshTime: null,
      refreshLoading: false,
      pages: {
        current: 1,
        size: 10,
        total: 0
      }
    }
  },
  watch: {
    $route(to, from) {
      // console.log('监听路由变化', this.$route.params.c)
      let c = this.$route.params.c
      if (c) {
        this.buyOrSell = this.$route.params.c.split('-')[0]
        this.coinActive = this.$route.params.c.split('-')[1]
      }
      this.loadAd(1)
    }
  },
  async created() {
    let c = this.$route.params.c
    if (c) {
      this.buyOrSell = this.$route.params.c.split('-')[0]
      this.coinActive = this.$route.params.c.split('-')[1]
    }

    await this.getCurrencyList()
    await this.getLegalList()
    this.loadAd(1) // 获取广告

    if (this.isLogin) {
      this.queryPayWay() // 获取支付方式
    }
  },
  computed: {
    ...mapState(['isLogin', 'certificationInfo'])
  },
  methods: {
    ...mapMutations(['SET_ATCIVENAV']),
    changePage(val) {
      this.pages.current = val
      this.loadAd()
    },
    /* 获取支付方式 */
    queryPayWay() {
      queryPayWay().then(res => {
        this.payList = res
      })
    },
    /* 选择刷新时间 */
    clickRefresh(name) {
      switch(name) {
        case '0':
          this.refreshTime && clearTimeout(this.refreshTime)
          this.refreshText = this.$t('trade.zbcl')
          return;
        case '5':
          this.refreshText = this.$t('trade.zdsx5')
          break;
        case '10':
          this.refreshText = this.$t('trade.zdsx10')
          break;
        case '20':
          this.refreshText = this.$t('trade.zdsx20')
          break;
      }
      this.refresh(Number(name))
    },
    /* 刷新设置 */
    refresh(time) {
      this.refreshTime && clearTimeout(this.refreshTime)
      this.refreshTime = setTimeout(() => {
        this.loadAd()
        this.refresh(time)
      }, time * 1000)
    },
    /* 下单 */
    submitOrder(name) {
      console.log(JSON.parse(JSON.stringify(this.formInline)))
      this.$refs[name].validate(valid => {
        if (valid) {
          
          this.$set(this.formInline, 'disabled', true)
          otcOrder({
            // 交易数量不能为空
            amount: this.formInline.num,
            // "amount": 200,
            // 货币类型不能为空=货币类型 1：法币，2：数字货币
            category: 2,
            // 广告Id不能为空
            marketId: this.tradeId,
            // "marketId": '90',
            // 资金密码
            // password: '',
            // 支付方式
            paymentId: this.buyOrSell == 'sell' ? this.formInline.paymentId.join(',') : ''
          })
            .then(res => {
              console.log(res)
              // 跳转路由,传接口返回的ID
              if (res) {
                this.$router.push({
                  name: 'orderInfo',
                  params: {
                    id: res
                  }
                })
              }
            })
            .finally(() => {
              this.$set(this.formInline, 'disabled', false)
            })
        }
      })
    },
    /* 输入总价 */
    totalPriceInput() {
      // 只能输入两位小数
      this.formInline.totalPrice = this.formInline.totalPrice.replace(
        /^\D*(\d*(?:\.\d{0,2})?).*$/g,
        '$1'
      )

      // 计算数量 = 总价 / 单价
      let num = this.$yj.accDiv(
        this.formInline.totalPrice,
        this.advInfo.posterPrice
      )
      if (num == 0) {
        this.$set(this.formInline, 'num', '')
      } else {
        this.$set(
          this.formInline,
          'num',
          this.toFixeds(num, this.coinActiveScale)
        )
      }
    },
    /* 输入数量 */
    numInput() {
      // 只能输入两位小数
      this.formInline.num = this.formInline.num.replace(
        /^\D*(\d*(?:\.\d{0,2})?).*$/g,
        '$1'
      )

      // 计算总价 = 数量 * 单价
      let num = this.$yj.accMul(this.formInline.num, this.advInfo.posterPrice)
      if (num == 0) {
        this.$set(this.formInline, 'totalPrice', '')
      } else {
        this.$set(
          this.formInline,
          'totalPrice',
          this.toFixeds(num, this.currencyScale)
        )
      }
    },
    /* 获取广告详情 */
    getIdAdv() {
      getIdAdv(this.marketNo).then(res => {
        this.advInfo = res
      })
    },
    /* 打开详情弹窗 */
    openTradeInfo(row, media) {
      if (this.isLogin) {
        if (!this.certificationInfo) {
          this.$Notice.info({
            title: '提示',
            desc: "请先完成实名认证！"
          })
          return
        }
        this.formInline = {
          totalPrice: '',
          num: '',
          paymentId: []
        }
        this.getPaymentList() // 获取收款方式列表

        this.$refs['formInline'] && this.$refs['formInline'].resetFields()
        if (media == 'mobile') {
          this.popShow = true
        } else {
          this.modalShow = true
          // this.$set( row, 'modalShow', true)
        }
        this.marketNo = row.marketNo
        this.tradeId = row.id
        this.getIdAdv()
      } else {
        this.$router.push({
          path: '/login'
        })
      }
    },
    /* 发布委托单，切换买卖 */
    sideChange() {
      this.releaseForm.paymentIds = []
    },
    /* 搜索金额 */
    searchAmount() {
      this.loadAd(1)
    },
    /* 获取收款列表 */
    getPaymentList() {
      getPaymentList().then(res => {
        if (res.length) {
          this.paymentList = res.filter(item => {
            return item.status == 1
          })
          this.formInline.paymentId = [this.paymentList[0].id]
        } else {
          this.paymentList = []
        }
      })
    },
    /* 选择支付方式 */
    changePay(val) {
      this.currentPay = val
      this.loadAd(1)
    },
    /* 选择币种 */
    changeCurrency(val) {
      console.log(val)
      this.currentCurrency = val
      const arr = this.legalList.filter(item => {
        return item.fiatCurrency == val
      })
      this.currentImg = arr[0].imageUrl
      this.loadAd(1)
    },
    /* 查询法定货币列表 */
    getLegalList() {
      return new Promise(resolve => {
        getLegalList().then(res => {
          this.legalList = res
          resolve()
        })
      })
    },
    /* 获取币种列表 */
    getCurrencyList() {
      return new Promise(resolve => {
        getCurrencyList().then(res => {
          this.coins = res
          let arr = res.filter(item => {
            return item.currency == this.coinActive.toUpperCase()
          })
          this.coinActiveScale = arr[0].withdrawScale
          resolve(res)
        })
      })
    },
    /* 成为商家 */
    goBusiness() {
      if (this.isLogin) {
        // 提示用户下载App完成视频认证
        this.$Message.warning('后期跳转新页面，提示用户下载App完成视频认证')
        // this.$router.push({
        //   path: "/identbusiness"
        // });
      } else {
        // this.$Message.warning("请先登录");
        this.$router.push({
          path: '/login'
        })
      }
    },
    /* 加载广告 */
    loadAd(pageNo) {
      console.log('pageNo', pageNo) // 当前页
      console.log('this.coinActive', this.coinActive)

      // 根据当前币种找对应ID
      let currencyId = this.coins.filter(item => {
        return item.currency == this.coinActive.toUpperCase()
      })

      // 根据选择法币找对应ID
      let fiatId = this.legalList.filter(item => {
        return item.fiatCurrency == this.currentCurrency.toUpperCase()
      })
      this.currencyScale = fiatId[0].scale

      this.tableLoading = true
      this.refreshLoading = true
      getAdList({
        current: pageNo || this.pages.current,
        size: this.pages.size,
        side: this.buyOrSell == 'buy' ? 2 : 1, // 1买 2卖
        currencyId: currencyId[0].id, // 币种ID
        currencyName: this.coinActive.toUpperCase(), // 币种名称
        fiatId: fiatId[0].id, // 法定货币币种ID
        fiatCurrency: this.currentCurrency.toUpperCase(), // 法币token 如CNY
        userSide: this.buyOrSell == 'buy' ? 1 : 2, // 用户交易买卖方向[1:买,2:卖] ---1
        payWay: this.currentPay, // 支付方式
        tradeAmount: this.tradeAmount // 金额
      })
        .then(res => {
          this.advertiment.ask.rows = res.records || []
          this.pages.total = res.total
        })
        .finally(() => {
          this.tableLoading = false
          setTimeout(() => {
            this.refreshLoading = false
          }, 400)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
// select
::v-deep .ivu-select-single .ivu-select-prefix {
  padding-top: 2px;
}
::v-deep .ivu-select-input {
  height: 30px;
  line-height: 30px;
}
::v-deep .ivu-btn-error {
  background-color: #ff5f67;
}
::v-deep .ivu-modal-confirm-footer {
  border: none !important;
}
::v-deep .ivu-table-wrapper .ivu-table .ivu-table-row td {
  padding: 16px 0;
}

// 弹窗
.modal-wrap {
  padding: 20px;
  font-size: 14px;
  .auth {
    padding: 20px 0;
    div {
      color: #007aff;
      padding-right: 18px;
    }
  }
  .modal-right {
    width: 520px;
    border: 1px solid #dddddd;
    border-radius: 4px;
    .top {
      padding: 20px;
      border-bottom: 1px dashed #ddd;
    }
    .bot {
      padding: 20px;
    }
  }
}

.table-wrap {
  background-color: #f2f6fd;
  min-height: 600px;
  .table-con {
    width: 1200px;
    margin: 0 auto;
  }
}

.adv-list-wrap {
  .table-title {
    height: 38px;
    background: #ffffff;
    border-radius: 4px;
    padding: 0 20px;
    span {
      color: #999;
    }
  }
  .table-list {
    margin-top: 10px;
    background-color: #fff;
    padding: 0 20px;
    border-radius: 4px;
    .item {
      min-height: 94px;
    }
    .item-wrap {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: -20px;
        right: -20px;
        height: 1px;
        background-color: #e6ecf2;
      }
    }
    .item-wrap:last-child {
      &:after {
        height: 0;
      }
    }
  }
  // 修改表格列宽度
  .width0 {
    width: 280px;
  }
  .width1 {
    width: 280px;
  }
  .width2 {
    width: 260px;
  }
  .width3 {
    width: 200px;
  }
  .width4 {
    width: 180px;
  }
}
.pay-btn {
  white-space: nowrap;
  background-color: #f8fafd;
  padding: 4px 8px;
  border-radius: 4px;
  margin: 4px 8px 4px 0;
}

.screen-wrap {
  width: 1200px;
  height: 98px;
  margin: 0 auto;
}
// 购买出售按钮切换
.buy-sell-wrap {
  border: 1px solid #e9ebf2;
  padding: 4px;
  margin: 10px 0;
  border-radius: 4px;
  .btn {
    color: #333;
    display: block;
    height: 32px;
    line-height: 32px;
    padding: 0 28px;
    text-align: center;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
  }
  .buy-btn.on {
    background-color: #19be6b;
    color: #fff;
  }
  .sell-btn.on {
    background-color: #ff5f67;
    color: #fff;
  }
}

.coin-wrap {
  .coin-btn {
    color: #333;
  }
  .on {
    color: #19be6b;
    font-weight: 600;
  }
  .on-sell {
    color: #ff5f67;
  }
}

// 总金额筛选
::v-deep .ivu-input-search {
  background: transparent !important;
  border-color: #dcdee2 !important;
  color: #2d8cf0 !important;
}
.content-wraps {
  width: 1200px;
  margin: 0 auto;
  background-color: #0b1520;
  padding-top: 60px;
  padding-bottom: 20px;
  .containers {
    width: 100%;
    margin: 20px 0;
    
    .content {
      width: 100%;
      margin: 20px auto;
      background-color: #192330;
      border-radius: 4px;
    }
    .advantage {
      background-color: #192330;
      border-radius: 4px;
      ul {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 30px;
        li {
          width: 25%;
          list-style-type: none;
          min-height: 190px;
          div {
            text-align: center;
          }
          div.image {
            width: 50px;
            height: 50px;
            margin: 20px auto;
            img {
              width: 80%;
              // height: 80%;
              vertical-align: middle;
            }
          }
          div.title {
            line-height: 30px;
            font-size: 16px;
            color: #fff;
          }
          div.content1 {
            padding: 20px 40px;
            line-height: 20px;
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
}
.abs-right {
  position: absolute;
  right: 10px;
  top: 2px;
  font-size: 12px;
  .all {
    cursor: pointer;
    color: #007aff;
  }
}

.xs-list-wrap {
  padding: 0 24px 0;
  .card {
    background-color: #fff;
    border: 1px solid #ecf1f8;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 14px;
  }
  .list-line {
    margin: 14px 0;
    border-top: 1px dashed #ecf1f8;
  }
}
.xs-pop-wrap {
  width: 100vw;
  min-height: 100vh;
  padding: 0 28px 28px;
  .title {
    height: 55px;
    line-height: 55px;
    text-align: center;
    font-weight: bold !important;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      left: -28px;
      right: -28px;
      bottom: 0;
      border-bottom: 1px solid #eee;
    }
  }
}
.avatar {
  width: 32px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  border-radius: 64px;
  background-color: #007aff;
  em {
    font-style: normal;
    color: #fff;
  }
}
/* PC端 */
@media (min-width: 768px) {
  // 币种tab
  .tab-wrap {
    width: 1200px;
    margin: 0 auto;
    .p-flex {
      display: flex;
      align-items: center;
    }
  }
}

/* 手机端 */
@media (max-width: 767px) {
  .tab-wrap {
    width: 100%;
    padding: 1px 24px 0;
  }
  .table-wrap {
    border-radius: 40px 40px 0 0;
    padding-bottom: 40px;
    .table-con {
      width: 100%;
    }
  }
  .screen-wrap {
    width: 100%;
    padding: 0 24px;
  }
  .content-wraps {
    width: 100%;
  }
  .buy-sell-wrap {
    margin-bottom: 20px;
    .btn {
      width: 50%;
    }
  }
  .coin-wrap {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    .coin-btn {
      flex: 0 0 calc(25% - 6px);
      border: 1px solid #ccd2da;
      padding: 4px;
      border-radius: 2px;
      margin-left: 8px !important;
      margin-bottom: 8px;
      font-size: 12px;
      text-align: center;
    }
    .on {
      font-weight: normal;
      border-color: #19be6b;
    }
    .on-sell {
      border-color: #ff5f67;
    }
    .coin-btn:nth-child(4n+1) {
      margin-left: 0 !important;
    }
  }
}
</style>