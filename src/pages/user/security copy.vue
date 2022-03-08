<template>
  <div class="security-wrap">
    <div class="security-con">
      <div class="padding-left-clear rightarea user account-box">
        <div class="rightarea-con">
          <div class="user-top-icon">
            <div class="user-icons">
              <!-- <div class="user-face user-avatar-public">
                            <span class="user-avatar-in">{{usernameS}}</span>
                        </div>
                        <div class="user-name" style="line-height:52px">
                            <span style="line-height:52px">{{user.username}}</span>
                        </div> -->
            </div>
            <Row class="user-right">
              <Col :xs="24" :sm="24" :md="8" :lg="8">
                <i class="m3"></i>
                <div
                  class="itp"
                  v-if="
                    user.realVerified == 0 &&
                    user.phoneVerified == 0 &&
                    user.fundsVerified == 0
                  "
                >
                  {{ $t('uc.safe.safelevel_low') }}
                </div>
                <div
                  class="itp"
                  v-else-if="
                    user.realVerified == 1 &&
                    user.phoneVerified == 1 &&
                    user.fundsVerified == 1
                  "
                >
                  {{ $t('uc.safe.safelevel_high') }}
                </div>
                <div class="itp" v-else>
                  {{ $t('uc.safe.safelevel_medium') }}
                </div>
              </Col>
            </Row>
          </div>
          <section class="accountContent">
            <div class="account-in">
              <!-- 1 -->
              <div class="account-item" style="display: none">
                <div class="account-item-in">
                  <Icon type="person" style="font-size: 18px"></Icon>
                  <span class="card-number">{{ $t('uc.safe.nickname') }}</span>
                  <p class="bankInfo" style="color: #fff">//</p>
                  <span>{{ $t('uc.safe.binded') }}</span>
                </div>
              </div>
              <!-- 6 -->
              <!-- 实名认证 [0:待审核,1:审核中,2:审核通过,3:审核失败] -->
              <div class="account-item">
                <div class="account-item-in">
                  <Icon type="md-card" size="18" />
                  <span class="card-number">{{ $t('uc.safe.verified') }}</span>

                  <div class="right u-flex u-row-between" v-if="!realNameInfo">
                    <!-- 為保障您的賬户安全，請完成實名認證後方可交易操作 -->
                    <p class="bankInfo" style="color: #828ea1; font-size: 13px">
                      {{ $t('uc.safe.verifiedtip') }}
                    </p>
                    <!-- 未认证 -->
                    <a class="btn" @click="realNameShow = true">{{
                      $t('uc.safe.notverified')
                    }}</a>
                  </div>

                  <div
                    class="right u-flex u-row-between"
                    v-if="realNameInfo.state == 0"
                  >
                    <!-- 為保障您的賬户安全，請完成實名認證後方可交易操作 -->
                    <p class="bankInfo" style="color: #828ea1; font-size: 13px">
                      {{ $t('uc.safe.verifiedtip') }}
                    </p>
                    <!-- 待审核 -->
                    <span style="color: #828ea1; font-size: 13px">
                      待审核
                    </span>
                  </div>

                  <div
                    class="right u-flex u-row-between"
                    v-if="realNameInfo && realNameInfo.state == 1"
                  >
                    <!-- 為保障您的賬户安全，請完成實名認證後方可交易操作 -->
                    <p class="bankInfo" style="color: #828ea1; font-size: 13px">
                      {{ $t('uc.safe.verifiedtip') }}
                    </p>
                    <!-- 審核中 -->
                    <span>{{ $t('uc.safe.binding') }}</span>
                  </div>

                  <div
                    class="right u-flex u-row-between"
                    v-if="realNameInfo && realNameInfo.state == 2"
                  >
                    <!-- 审核通过 显示用户名 -->
                    <p class="bankInfo" style="color: #fff; font-size: 13px">
                      {{ realNameInfo.cardName }}
                    </p>
                    <!-- 已認證 -->
                    <div>
                      <span>{{ $t('uc.safe.verifypass') }}</span>
                      <!-- <span class="u-p-l-20" v-if="realNameInfo.auditLevel == 1">基础认证</span>
                      <span class="u-p-l-20" v-if="realNameInfo.auditLevel == 2">视频认证</span> -->
                    </div>
                  </div>

                  <div
                    class="right u-flex u-row-between"
                    v-if="realNameInfo && realNameInfo.state == 3"
                  >
                    <!-- 审核未通过 -->
                    <p class="bankInfo" style="color: #f0a70a; font-size: 13px">
                      审核未通过，请重试。
                    </p>
                    <!-- 重试 -->
                    <a
                      class="btn"
                      @click="realNameShow = true"
                      :title="user.realNameRejectReason"
                      >{{ $t('uc.safe.bindretry') }}</a
                    >
                  </div>
                </div>

                <!-- 实名认证弹窗 -->
                <Modal
                  class="detail"
                  v-model="realNameShow"
                  width="700px"
                  title="实名认证"
                  :mask-closable="false"
                  :footer-hide="true"
                >
                  <div class="detail-list" style="width: 100%">
                    <Form
                      ref="formValidate6"
                      :model="formValidate6"
                      :rules="ruleValidate"
                      :label-width="85"
                      style="text-align: center"
                    >
                      <!-- 真实姓名 -->
                      <FormItem :label="$t('uc.safe.realname')" prop="realName">
                        <Input
                          v-model="formValidate6.realName"
                          size="large"
                        ></Input>
                      </FormItem>
                      <!-- 身份证号 -->
                      <FormItem :label="$t('uc.safe.idcard')" prop="idCard">
                        <Input
                          v-model="formValidate6.idCard"
                          size="large"
                        ></Input>
                      </FormItem>
                      <div style="height: 220px">
                        <Col span="8">
                          <input
                            type="hidden"
                            name="imgPreview"
                            :value="imgPreview"
                          />
                          <div class="idcard-title">
                            {{ $t('uc.safe.upload_positive') }}
                          </div>
                          <img
                            id="frontCardImg"
                            style="width: 180px; height: 120px"
                            :src="frontCardImg"
                          />
                          <div class="acc_sc">
                            <Upload
                              ref="upload1"
                              :before-upload="beforeUpload"
                              :on-success="frontHandleSuccess"
                              :headers="uploadHeaders"
                              :action="uploadUrl"
                            >
                              <Button icon="ios-cloud-upload-outline">{{
                                $t('uc.safe.upload')
                              }}</Button>
                            </Upload>
                          </div>
                        </Col>
                        <Col span="8">
                          <input
                            type="hidden"
                            name="imgNext"
                            :value="imgNext"
                          />
                          <div class="idcard-title">
                            {{ $t('uc.safe.upload_negative') }}
                          </div>
                          <img
                            id="backCardImg"
                            style="width: 180px; height: 120px"
                            :src="backCardImg"
                          />
                          <div class="acc_sc">
                            <Upload
                              ref="upload2"
                              :before-upload="beforeUpload"
                              :on-success="backHandleSuccess"
                              :headers="uploadHeaders"
                              :action="uploadUrl"
                            >
                              <Button icon="ios-cloud-upload-outline">{{
                                $t('uc.safe.upload')
                              }}</Button>
                            </Upload>
                          </div>
                        </Col>
                        <Col span="8">
                          <input
                            type="hidden"
                            name="imgLast"
                            :value="imgLast"
                          />
                          <div class="idcard-title">
                            {{ $t('uc.safe.upload_hand') }}
                          </div>
                          <img
                            id="handCardImg"
                            style="width: 180px; height: 120px"
                            :src="handCardImg"
                          />
                          <div class="acc_sc">
                            <Upload
                              ref="upload3"
                              :before-upload="beforeUpload"
                              :on-success="handHandleSuccess"
                              :headers="uploadHeaders"
                              :action="uploadUrl"
                            >
                              <Button icon="ios-cloud-upload-outline">{{
                                $t('uc.safe.upload')
                              }}</Button>
                            </Upload>
                          </div>
                        </Col>
                      </div>
                      <div class="idcard-desc u-text-left">
                        <p>{{ $t('uc.safe.idcard_verifymsg1') }}</p>
                        <p>{{ $t('uc.safe.idcard_verifymsg2') }}</p>
                        <p>{{ $t('uc.safe.idcard_verifymsg3') }}</p>
                      </div>
                      <!-- Button -->
                      <!-- <FormItem style="text-align: center">
                        <Button
                          type="primary"
                          @click="handleSubmit('formValidate6')"
                          style="margin-left: -85px"
                          >{{ $t("uc.safe.save") }}</Button
                        >
                        <Button
                          @click="handleReset('formValidate6')"
                          style="margin-left: 8px"
                          >{{ $t("uc.safe.reset") }}</Button
                        >
                      </FormItem> -->

                      <div class="u-text-right">
                        <Button type="text" @click="realNameShow = false"
                          >取消</Button
                        >
                        <Button
                          type="primary"
                          @click="handleSubmit('formValidate6')"
                          class="u-m-l-8"
                          >{{ $t('common.ok') }}</Button
                        >
                      </div>
                    </Form>
                  </div>
                </Modal>
              </div>
              <!-- 2 -->
              <!-- 邮箱 -->
              <div class="account-item">
                <div class="account-item-in">
                  <Icon type="ios-mail" size="20" color="#00b5f6;" />
                  <span class="card-number">{{ $t('uc.safe.email') }}</span>

                  <div
                    class="right u-flex u-row-between"
                    v-if="securityInfo.emailSetting[0]"
                  >
                    <!-- 显示邮箱号 -->
                    <p class="bankInfo" style="color: #fff; font-size: 13px">
                      {{ securityInfo.email }}
                    </p>
                    <!-- 已绑定 -->
                    <div>
                      <a class="btn" @click="editEemailShowa = true"
                        >更换邮箱</a
                      >
                      <a
                        class="btn u-p-l-20"
                        @click="onOff(3)"
                        v-if="securityInfo.emailSetting[1]"
                        >关闭验证</a
                      >
                      <a class="btn u-p-l-20" @click="onOff(8)" v-else
                        >开启验证</a
                      >
                    </div>
                  </div>

                  <div class="right u-flex u-row-between" v-else>
                    <!-- 綁定郵箱 -->
                    <p class="bankInfo" style="color: #828ea1; font-size: 13px">
                      {{ $t('uc.safe.bindemail') }}
                    </p>
                    <!-- 綁定 -->
                    <a class="btn" @click="emailShow = true">{{
                      $t('uc.safe.bind')
                    }}</a>
                  </div>
                </div>

                <!-- 更换邮箱 - 第1步 -->
                <Modal
                  class="detail"
                  v-model="editEemailShowa"
                  width="480px"
                  title="更换邮箱"
                  :mask-closable="false"
                  :footer-hide="true"
                >
                  <div class="detail-list">
                    <Form
                      ref="formValidate2a"
                      :model="formValidate2a"
                      :rules="ruleValidate"
                      label-position="top"
                    >
                      <!-- 邮箱验证码 -->
                      <div class="u-p-b-16">
                        获取并输入邮箱 {{ securityInfo.email }} 收到的验证码
                      </div>
                      <FormItem
                        :label="$t('uc.safe.emailcode')"
                        prop="vailCode1"
                      >
                        <Input v-model="formValidate2a.vailCode1" size="large">
                          <div class="timebox" slot="append">
                            <Button
                              type="text"
                              @click="send(17, 'uCode17', '', 'formValidate2a')"
                              :disabled="formValidate2a.disabled"
                            >
                              <u-verification-code
                                ref="uCode17"
                                @change="
                                  text => {
                                    timeTips17 = text
                                  }
                                "
                                @end="formValidate2a.disabled = false"
                              ></u-verification-code>
                              {{ timeTips17 }}
                            </Button>
                          </div>
                        </Input>
                      </FormItem>
                      <!-- Button -->
                      <div class="u-text-right">
                        <Button type="text" @click="editEemailShowa = false"
                          >取消</Button
                        >
                        <Button
                          type="primary"
                          @click="handleSubmit('formValidate2a')"
                          class="u-m-l-8"
                          >{{ $t('common.ok') }}</Button
                        >
                      </div>
                    </Form>
                  </div>
                </Modal>

                <!-- 更换邮箱 - 第2步 -->
                <Modal
                  class="detail"
                  v-model="editEemailShowb"
                  width="480px"
                  title="更换邮箱"
                  :mask-closable="false"
                  :footer-hide="true"
                >
                  <div class="detail-list">
                    <Form
                      ref="formValidate2b"
                      :model="formValidate2b"
                      :rules="ruleValidate"
                      label-position="top"
                    >
                      <!-- 邮箱验证码 -->
                      <div class="u-p-b-16">更换邮箱后，24小时内禁止体现</div>
                      <FormItem label="新邮箱" prop="mail">
                        <Input
                          v-model="formValidate2b.mail"
                          size="large"
                        ></Input>
                      </FormItem>
                      <FormItem
                        :label="$t('uc.safe.emailcode')"
                        prop="vailCode1"
                      >
                        <Input v-model="formValidate2b.vailCode1" size="large">
                          <div class="timebox" slot="append">
                            <Button
                              type="text"
                              @click="send(20, 'uCode12', '', 'formValidate2b')"
                              :disabled="formValidate2b.disabled"
                            >
                              <!-- <span v-if="sendMsgDisabled1">{{
                                time1 + $t("uc.safe.second")
                              }}</span>
                              <span v-if="!sendMsgDisabled1">{{
                                $t("uc.safe.clickget")
                              }}</span> -->

                              <u-verification-code
                                ref="uCode12"
                                @change="
                                  text => {
                                    timeTips12 = text
                                  }
                                "
                                @end="formValidate2b.disabled = false"
                              ></u-verification-code>
                              {{ timeTips12 }}
                            </Button>
                          </div>
                        </Input>
                      </FormItem>
                      <!-- Button -->
                      <div class="u-text-right">
                        <Button type="text" @click="editEemailShowa = false">{{
                          $t('uc.api.cancel')
                        }}</Button>
                        <Button
                          type="primary"
                          @click="handleSubmit('formValidate2b')"
                          class="u-m-l-8"
                          >{{ $t('common.ok') }}</Button
                        >
                      </div>
                    </Form>
                  </div>
                </Modal>

                <!-- 绑定邮箱 -->
                <Modal
                  class="detail"
                  v-model="emailShow"
                  width="480px"
                  title="绑定邮箱"
                  :mask-closable="false"
                  :footer-hide="true"
                >
                  <div class="detail-list">
                    <Form
                      ref="formValidate2"
                      :model="formValidate2"
                      :rules="ruleValidate"
                      label-position="top"
                    >
                      <!-- 邮箱号 -->
                      <FormItem :label="$t('uc.safe.email')" prop="mail">
                        <Input
                          v-model="formValidate2.mail"
                          size="large"
                        ></Input>
                      </FormItem>
                      <FormItem
                        :label="$t('uc.safe.emailcode')"
                        prop="vailCode1"
                      >
                        <Input v-model="formValidate2.vailCode1" size="large">
                          <div class="timebox" slot="append">
                            <Button
                              type="text"
                              @click="send(11, 'uCode11', '', 'formValidate2')"
                              :disabled="formValidate2.disabled"
                            >
                              <u-verification-code
                                ref="uCode11"
                                @change="
                                  text => {
                                    timeTips11 = text
                                  }
                                "
                                @end="formValidate2.disabled = false"
                              ></u-verification-code>
                              {{ timeTips11 }}
                            </Button>
                          </div>
                        </Input>
                      </FormItem>
                      <!-- Button -->
                      <div class="u-text-right">
                        <Button type="text" @click="emailShow = false"
                          >取消</Button
                        >
                        <Button
                          type="primary"
                          @click="handleSubmit('formValidate2')"
                          class="u-m-l-8"
                          >{{ $t('common.ok') }}</Button
                        >
                      </div>
                    </Form>
                  </div>
                </Modal>
              </div>
              <!-- 3 -->
              <!-- 手机 -->
              <div class="account-item">
                <div class="account-item-in">
                  <Icon type="ios-call" size="20" />
                  <span class="card-number">{{ $t('uc.safe.phone') }}</span>

                  <div
                    class="right u-flex u-row-between"
                    v-if="securityInfo.mobileSetting[0]"
                  >
                    <!-- 显示手机号码 -->
                    <p class="bankInfo" style="color: #fff; font-size: 13px">
                      {{ securityInfo.mobile }}
                    </p>
                    <div>
                      <!-- <span>{{ $t("uc.safe.binded") }}</span> -->
                      <a class="btn u-m-l-20" @click="mobileShowa = true"
                        >更换手机</a
                      >
                      <a
                        class="btn u-m-l-20"
                        @click="onOff(1)"
                        v-if="securityInfo.mobileSetting[1]"
                        >关闭验证</a
                      >
                      <a class="btn u-m-l-20" @click="onOff(7)" v-else
                        >开启验证</a
                      >
                    </div>
                  </div>

                  <div class="right u-flex u-row-between" v-else>
                    <p class="bankInfo" style="color: #828ea1; font-size: 13px">
                      {{ $t('uc.safe.bindphone') }}
                    </p>

                    <a class="btn" @click="bindFn">{{ $t('uc.safe.bind') }}</a>
                  </div>
                </div>

                <!-- 绑定手机 -->
                <Modal
                  class="detail"
                  v-model="mobileShow"
                  width="480px"
                  title="绑定手机"
                  :mask-closable="false"
                  :footer-hide="true"
                >
                  <div class="detail-list">
                    <Form
                      ref="formValidate3"
                      :model="formValidate3"
                      :rules="ruleValidate"
                      label-position="top"
                    >
                      <FormItem
                        :label="$t('uc.safe.phone')"
                        prop="mobile"
                        class="phone"
                        style="width: 100%"
                      >
                        <div class="u-flex u-col-top">
                          <Select
                            v-model="formValidate3.stateCode"
                            size="large"
                            filterable
                            class="area u-m-r-8"
                            style="width: 100px"
                            placeholder=""
                          >
                            <Option
                              :label="'+' + item.code"
                              :value="item.code"
                              v-for="(item, index) in countryList"
                              :key="index"
                            >
                              <span>+{{ item.code }}</span>
                              <span style="margin-left: 10px; color: #ccc">{{
                                item.name
                              }}</span>
                            </Option>
                          </Select>
                          <Input
                            v-model="formValidate3.mobile"
                            size="large"
                          ></Input>
                        </div>
                      </FormItem>

                      <!-- 登录密码 -->
                      <!-- <FormItem :label="$t('uc.safe.loginpwd')" prop="password">
                                        <Input v-model="formValidate3.password" size="large" type="password"></Input>
                                    </FormItem> -->
                      <!-- 手机验证码 -->
                      <FormItem
                        :label="$t('uc.safe.phonecode')"
                        prop="vailCode2"
                      >
                        <Input v-model="formValidate3.vailCode2" size="large">
                          <!-- <Button slot="append">点击获取</Button> -->
                          <div class="timebox" slot="append">
                            <Button
                              @click="send(2, 'uCode2', '', 'formValidate3')"
                              :disabled="formValidate3.disabled"
                            >
                              <u-verification-code
                                ref="uCode2"
                                @change="
                                  text => {
                                    timeTips2 = text
                                  }
                                "
                                @end="formValidate3.disabled = false"
                              ></u-verification-code>
                              {{ timeTips2 }}
                            </Button>
                          </div>
                        </Input>
                      </FormItem>
                      <!-- Button -->
                      <div class="u-text-right">
                        <Button type="text" @click="mobileShow = false">{{
                          $t('uc.api.cancel')
                        }}</Button>
                        <Button
                          type="primary"
                          @click="handleSubmit('formValidate3')"
                          >{{ $t('common.ok') }}</Button
                        >
                      </div>
                    </Form>
                  </div>
                </Modal>

                <!-- 更换手机 - 第1步 -->
                <Modal
                  class="detail"
                  v-model="mobileShowa"
                  width="480px"
                  title="更换手机"
                  :mask-closable="false"
                  :footer-hide="true"
                >
                  <div class="detail-list">
                    <Form
                      ref="formValidate3a"
                      :model="formValidate3a"
                      :rules="ruleValidate"
                      label-position="top"
                    >
                      <!-- 邮箱验证码 -->
                      <div class="u-p-b-16">
                        获取并输入手机 {{ securityInfo.mobile }} 收到的验证码
                      </div>
                      <FormItem
                        :label="$t('uc.safe.phonecode')"
                        prop="vailCode2"
                      >
                        <Input v-model="formValidate3a.vailCode2" size="large">
                          <div class="timebox" slot="append">
                            <Button
                              type="text"
                              @click="send(16, 'uCode16', '', 'formValidate3a')"
                              :disabled="formValidate3a.disabled"
                            >
                              <u-verification-code
                                ref="uCode16"
                                @change="
                                  text => {
                                    timeTips16 = text
                                  }
                                "
                                @end="formValidate3a.disabled = false"
                              ></u-verification-code>
                              {{ timeTips16 }}
                            </Button>
                          </div>
                        </Input>
                      </FormItem>
                      <!-- Button -->
                      <div class="u-text-right">
                        <Button type="text" @click="mobileShowa = false"
                          >取消</Button
                        >
                        <Button
                          type="primary"
                          @click="handleSubmit('formValidate3a')"
                          class="u-m-l-8"
                          >{{ $t('common.ok') }}</Button
                        >
                      </div>
                    </Form>
                  </div>
                </Modal>

                <!-- 更换手机 - 第2步 -->
                <Modal
                  class="detail"
                  v-model="mobileShowb"
                  width="480px"
                  title="更换绑定手机"
                  :mask-closable="false"
                  :footer-hide="true"
                >
                  <div class="detail-list">
                    <Form
                      ref="formValidate3b"
                      :model="formValidate3b"
                      :rules="ruleValidate"
                      label-position="top"
                    >
                      <FormItem
                        :label="$t('uc.safe.phone')"
                        prop="mobile"
                        class="phone"
                        style="width: 100%"
                      >
                        <div class="u-flex u-col-top">
                          <Select
                            v-model="formValidate3b.stateCode"
                            size="large"
                            filterable
                            class="area u-m-r-8"
                            style="width: 100px"
                            placeholder=""
                          >
                            <Option
                              :label="'+' + item.code"
                              :value="item.code"
                              v-for="(item, index) in countryList"
                              :key="index"
                            >
                              <span>+{{ item.code }}</span>
                              <span style="margin-left: 10px; color: #ccc">{{
                                item.name
                              }}</span>
                            </Option>
                          </Select>
                          <Input
                            v-model="formValidate3b.mobile"
                            size="large"
                          ></Input>
                        </div>
                      </FormItem>

                      <!-- 手机验证码 -->
                      <FormItem
                        :label="$t('uc.safe.phonecode')"
                        prop="vailCode2"
                      >
                        <Input v-model="formValidate3b.vailCode2" size="large">
                          <!-- <Button slot="append">点击获取</Button> -->
                          <div class="timebox" slot="append">
                            <Button
                              @click="send(19, 'uCode19', '', 'formValidate3b')"
                              :disabled="formValidate3b.disabled"
                            >
                              <u-verification-code
                                ref="uCode19"
                                @change="
                                  text => {
                                    timeTips19 = text
                                  }
                                "
                                @end="formValidate3b.disabled = false"
                              ></u-verification-code>
                              {{ timeTips19 }}
                            </Button>
                          </div>
                        </Input>
                      </FormItem>
                      <!-- Button -->
                      <div class="u-text-right">
                        <Button type="text" @click="mobileShowb = false">{{
                          $t('uc.api.cancel')
                        }}</Button>
                        <Button
                          type="primary"
                          @click="handleSubmit('formValidate3b')"
                          >{{ $t('common.ok') }}</Button
                        >
                      </div>
                    </Form>
                  </div>
                </Modal>
              </div>
              <!-- 谷歌验证 -->
              <div class="account-item">
                <div class="account-item-in">
                  <Icon type="logo-google" size="20" />
                  <span class="card-number">谷歌验证器</span>

                  <div class="right u-flex u-row-between">
                    <!-- 显示手机号码 -->
                    <p class="bankInfo" style="color: #828ea1; font-size: 13px">
                      用于登录、提币、找回密码、修改安全设置、管理API时进行安全验证
                    </p>
                    <div v-if="securityInfo.googleSetting[0]">
                      <a class="btn" @click="googleFn(1)">更换谷歌验证器</a>
                      <a
                        class="btn u-m-l-20"
                        @click="onOff(9)"
                        v-if="!securityInfo.googleSetting[1]"
                        >开启验证</a
                      >
                      <a class="btn u-m-l-20" @click="onOff(5)" v-else
                        >关闭验证</a
                      >
                    </div>
                    <a class="btn" @click="googleFn(0)" v-else
                      >绑定谷歌验证器</a
                    >
                  </div>
                </div>

                <!-- 谷歌验证 -->
                <Modal
                  class="detail"
                  v-model="googleShow"
                  width="700px"
                  :title="googleTit"
                  :mask-closable="false"
                  :footer-hide="true"
                >
                  <div class="detail-list">
                    <div class="u-p-10 u-p-b-40">
                      <p class="u-p-b-10">
                        1. 请在手机上安装一个Google Authenticator
                      </p>
                      <p>
                        2. 安装完成后打开Google
                        Authenticator，点击＋添加按钮，选择手动输入密钥，页面中填写您的账户名(手机或邮箱)和下方密钥
                      </p>
                      <div class="u-p-b-20 u-text-center">
                        <!-- <qrcode-vue :value="googleValue"></qrcode-vue> -->
                        <div class="u-font-20 u-p-t-20">{{ googleValue }}</div>
                        <Button class="u-m-t-10">复制秘钥</Button>
                      </div>
                      <p>
                        3.
                        添加成功后，您将得到一个有一定时效的6位数验证码，请将该验证码填入下方输入框中(需要在验证码时效内)
                      </p>
                    </div>

                    <Form
                      ref="formValidate10"
                      :model="formValidate10"
                      :rules="ruleValidate"
                      label-position="top"
                    >
                      <FormItem :label="googleLabel" prop="googleAuthCode">
                        <Input
                          v-model="formValidate10.googleAuthCode"
                          size="large"
                        ></Input>
                      </FormItem>
                      <div class="u-text-right">
                        <Button type="text" @click="googleShow = false">{{
                          $t('uc.api.cancel')
                        }}</Button>
                        <Button
                          type="primary"
                          @click="handleSubmit('formValidate10', googleType)"
                          >{{ $t('common.ok') }}</Button
                        >
                      </div>
                    </Form>
                  </div>
                </Modal>
              </div>
              <!-- 4 -->
              <!-- 登录密码 -->
              <div class="account-item">
                <div class="account-item-in">
                  <Icon type="ios-lock" size="20"></Icon>
                  <span class="card-number">{{ $t('uc.safe.loginpwd') }}</span>

                  <div class="right u-flex u-row-between">
                    <p class="bankInfo" style="color: #828ea1; font-size: 13px">
                      {{ $t('uc.safe.logintip') }}
                    </p>
                    <!-- 修改 -->
                    <a
                      class="btn"
                      @click="loginPsShow = true"
                      v-if="securityInfo.mobileSetting[0]"
                      >{{ $t('uc.safe.edit') }}</a
                    >
                    <!-- 先绑定手机 -->
                    <a class="btn" @click="noPhone" v-else>{{
                      $t('uc.safe.edit')
                    }}</a>
                  </div>
                </div>

                <Modal
                  class="detail"
                  v-model="loginPsShow"
                  width="480px"
                  title="修改登录密码"
                  :mask-closable="false"
                  :footer-hide="true"
                >
                  <div class="detail-list">
                    <Form
                      ref="formValidate4"
                      :model="formValidate4"
                      :rules="ruleValidate"
                      label-position="top"
                    >
                      <!-- newPw -->
                      <FormItem :label="$t('uc.safe.newpwd')" prop="newPw">
                        <Input
                          v-model="formValidate4.newPw"
                          size="large"
                          type="password"
                        ></Input>
                      </FormItem>
                      <!-- newPwConfirm -->
                      <FormItem
                        :label="$t('uc.safe.confirmnewpwd')"
                        prop="newPwConfirm"
                      >
                        <Input
                          v-model="formValidate4.newPwConfirm"
                          size="large"
                          type="password"
                        ></Input>
                      </FormItem>
                      <!-- 邮箱验证码 -->
                      <div v-if="securityInfo.emailSetting[1]">
                        <div class="u-p-b-10" style="color: #9aa5b5">
                          获取并输入邮箱 {{ securityInfo.email }} 收到的验证码
                        </div>
                        <FormItem
                          :label="$t('uc.safe.emailcode')"
                          prop="emailCode"
                        >
                          <Input v-model="formValidate4.emailCode" size="large">
                            <div class="timebox" slot="append">
                              <Button
                                @click="send(27, 'uCode27', 'disabled')"
                                :disabled="formValidate.disabled"
                              >
                                <u-verification-code
                                  ref="uCode27"
                                  :keep-running="false"
                                  @change="
                                    text => {
                                      timeTips = text
                                    }
                                  "
                                  @end="formValidate.disabled = false"
                                ></u-verification-code>
                                {{ timeTips }}
                              </Button>
                            </div>
                          </Input>
                        </FormItem>
                      </div>
                      <!-- 手机验证码 -->
                      <div v-if="securityInfo.mobileSetting[1]">
                        <div class="u-p-b-10" style="color: #9aa5b5">
                          获取并输入手机 {{ securityInfo.mobile }} 收到的验证码
                        </div>
                        <FormItem
                          :label="$t('uc.safe.phonecode')"
                          prop="mobileCode"
                        >
                          <Input
                            v-model="formValidate4.mobileCode"
                            size="large"
                          >
                            <div class="timebox" slot="append">
                              <Button
                                @click="send(27, 'uCode270', 'disabled2')"
                                :disabled="formValidate.disabled2"
                              >
                                <u-verification-code
                                  ref="uCode270"
                                  :keep-running="false"
                                  @change="
                                    text => {
                                      timeTips270 = text
                                    }
                                  "
                                  @end="formValidate.disabled2 = false"
                                ></u-verification-code>
                                {{ timeTips270 }}
                              </Button>
                            </div>
                          </Input>
                        </FormItem>
                      </div>
                      <!-- 谷歌验证码 -->
                      <div v-if="securityInfo.googleSetting[1]">
                        <FormItem
                          :label="$t('uc.safe.googlecode')"
                          prop="googleAuthCode"
                        >
                          <Input
                            v-model="formValidate4.googleAuthCode"
                            size="large"
                          ></Input>
                        </FormItem>
                      </div>
                      <div class="u-text-right">
                        <Button type="text" @click="loginPsShow = false">{{
                          $t('uc.api.cancel')
                        }}</Button>
                        <Button
                          type="primary"
                          @click="handleSubmit('formValidate4', googleType)"
                          >{{ $t('common.ok') }}</Button
                        >
                      </div>
                    </Form>
                  </div>
                </Modal>
              </div>
              <!-- 5 -->
              <!-- 资金密码 -->
              <div class="account-item">
                <div class="account-item-in">
                  <Icon type="logo-bitcoin" size="20" />
                  <span class="card-number">{{ $t('uc.safe.fundpwd') }}</span>

                  <div class="right u-flex u-row-between">
                    <p class="bankInfo" style="color: #828ea1; font-size: 13px">
                      {{ $t('uc.safe.fundtip') }}
                    </p>
                    <!-- 先绑定手机 -->
                    <!-- <a
                      class="btn"
                      v-if="!securityInfo.mobileSetting[0]"
                      @click="noPhone"
                      >{{ $t("uc.safe.set") }}</a
                    > -->

                    <a
                      class="btn"
                      @click="capitalPsShow = true"
                      v-if="!securityInfo.tradeSetting[0]"
                      >{{ $t('uc.safe.set') }}</a
                    >
                    <a class="btn" @click="capitalPsShowa = true" v-else
                      >修改</a
                    >
                  </div>
                </div>

                <!-- 设置资金密码 -->
                <Modal
                  class="detail"
                  v-model="capitalPsShow"
                  width="480px"
                  title="设置资金密码"
                  :mask-closable="false"
                  :footer-hide="true"
                >
                  <div class="detail-list">
                    <Form
                      ref="formValidate7"
                      :model="formValidate7"
                      :rules="ruleValidate"
                      label-position="top"
                    >
                      <!-- newPw -->
                      <FormItem :label="$t('uc.safe.fundpwd')" prop="pw7">
                        <Input
                          v-model="formValidate7.pw7"
                          size="large"
                          type="password"
                        ></Input>
                      </FormItem>
                      <!-- newPwConfirm -->
                      <FormItem
                        :label="$t('uc.safe.confirmpwd')"
                        prop="pw7Confirm"
                      >
                        <Input
                          v-model="formValidate7.pw7Confirm"
                          size="large"
                          type="password"
                        ></Input>
                      </FormItem>
                      <!-- 邮箱验证码 -->
                      <div v-if="securityInfo.emailSetting[1]">
                        <div class="u-p-b-10" style="color: #9aa5b5">
                          获取并输入邮箱 {{ securityInfo.email }} 收到的验证码
                        </div>
                        <FormItem
                          :label="$t('uc.safe.emailcode')"
                          prop="emailCode"
                        >
                          <Input v-model="formValidate7.emailCode" size="large">
                            <div class="timebox" slot="append">
                              <Button
                                @click="send(26, 'uCode26', 'disabled')"
                                :disabled="formValidate.disabled"
                              >
                                <u-verification-code
                                  ref="uCode26"
                                  :keep-running="false"
                                  @change="
                                    text => {
                                      timeTips26 = text
                                    }
                                  "
                                  @end="formValidate.disabled = false"
                                ></u-verification-code>
                                {{ timeTips26 }}
                              </Button>
                            </div>
                          </Input>
                        </FormItem>
                      </div>
                      <!-- 手机验证码 -->
                      <div v-if="securityInfo.mobileSetting[1]">
                        <div class="u-p-b-10" style="color: #9aa5b5">
                          获取并输入手机 {{ securityInfo.mobile }} 收到的验证码
                        </div>
                        <FormItem
                          :label="$t('uc.safe.phonecode')"
                          prop="mobileCode"
                        >
                          <Input
                            v-model="formValidate7.mobileCode"
                            size="large"
                          >
                            <div class="timebox" slot="append">
                              <Button
                                @click="send(26, 'uCode260', 'disabled2')"
                                :disabled="formValidate.disabled2"
                              >
                                <u-verification-code
                                  ref="uCode260"
                                  :keep-running="false"
                                  @change="
                                    text => {
                                      timeTips260 = text
                                    }
                                  "
                                  @end="formValidate.disabled2 = false"
                                ></u-verification-code>
                                {{ timeTips260 }}
                              </Button>
                            </div>
                          </Input>
                        </FormItem>
                      </div>
                      <!-- 谷歌验证码 -->
                      <div v-if="securityInfo.googleSetting[1]">
                        <FormItem
                          :label="$t('uc.safe.googlecode')"
                          prop="googleAuthCode"
                        >
                          <Input
                            v-model="formValidate7.googleAuthCode"
                            size="large"
                          ></Input>
                        </FormItem>
                      </div>
                      <div class="u-text-right">
                        <Button type="text" @click="capitalPsShow = false">{{
                          $t('uc.api.cancel')
                        }}</Button>
                        <Button
                          type="primary"
                          @click="handleSubmit('formValidate7', 26)"
                          >{{ $t('common.ok') }}</Button
                        >
                      </div>
                    </Form>
                  </div>
                </Modal>

                <!-- 修改资金密码 -->
                <Modal
                  class="detail"
                  v-model="capitalPsShowa"
                  width="480px"
                  title="修改资金密码"
                  :mask-closable="false"
                  :footer-hide="true"
                >
                  <div class="detail-list">
                    <Form
                      ref="formValidate7"
                      :model="formValidate7"
                      :rules="ruleValidate"
                      label-position="top"
                    >
                      <!-- newPw -->
                      <FormItem :label="$t('uc.safe.fundpwd')" prop="pw7">
                        <Input
                          v-model="formValidate7.pw7"
                          size="large"
                          type="password"
                        ></Input>
                      </FormItem>
                      <!-- newPwConfirm -->
                      <FormItem
                        :label="$t('uc.safe.confirmpwd')"
                        prop="pw7Confirm"
                      >
                        <Input
                          v-model="formValidate7.pw7Confirm"
                          size="large"
                          type="password"
                        ></Input>
                      </FormItem>
                      <!-- 邮箱验证码 -->
                      <div v-if="securityInfo.emailSetting[1]">
                        <div class="u-p-b-10" style="color: #9aa5b5">
                          获取并输入邮箱 {{ securityInfo.email }} 收到的验证码
                        </div>
                        <FormItem
                          :label="$t('uc.safe.emailcode')"
                          prop="emailCode"
                        >
                          <Input v-model="formValidate7.emailCode" size="large">
                            <div class="timebox" slot="append">
                              <Button
                                @click="send(28, 'uCode28', 'disabled')"
                                :disabled="formValidate.disabled"
                              >
                                <u-verification-code
                                  ref="uCode28"
                                  :keep-running="false"
                                  @change="
                                    text => {
                                      timeTips28 = text
                                    }
                                  "
                                  @end="formValidate.disabled = false"
                                ></u-verification-code>
                                {{ timeTips28 }}
                              </Button>
                            </div>
                          </Input>
                        </FormItem>
                      </div>
                      <!-- 手机验证码 -->
                      <div v-if="securityInfo.mobileSetting[1]">
                        <div class="u-p-b-10" style="color: #9aa5b5">
                          获取并输入手机 {{ securityInfo.mobile }} 收到的验证码
                        </div>
                        <FormItem
                          :label="$t('uc.safe.phonecode')"
                          prop="mobileCode"
                        >
                          <Input
                            v-model="formValidate7.mobileCode"
                            size="large"
                          >
                            <div class="timebox" slot="append">
                              <Button
                                @click="send(28, 'uCode280', 'disabled2')"
                                :disabled="formValidate.disabled2"
                              >
                                <u-verification-code
                                  ref="uCode280"
                                  :keep-running="false"
                                  @change="
                                    text => {
                                      timeTips280 = text
                                    }
                                  "
                                  @end="formValidate.disabled2 = false"
                                ></u-verification-code>
                                {{ timeTips280 }}
                              </Button>
                            </div>
                          </Input>
                        </FormItem>
                      </div>
                      <!-- 谷歌验证码 -->
                      <div v-if="securityInfo.googleSetting[1]">
                        <FormItem
                          :label="$t('uc.safe.googlecode')"
                          prop="googleAuthCode"
                        >
                          <Input
                            v-model="formValidate7.googleAuthCode"
                            size="large"
                          ></Input>
                        </FormItem>
                      </div>
                      <div class="u-text-right">
                        <Button type="text" @click="capitalPsShowa = false">{{
                          $t('uc.api.cancel')
                        }}</Button>
                        <Button
                          type="primary"
                          @click="handleSubmit('formValidate7', 28)"
                          >{{ $t('common.ok') }}</Button
                        >
                      </div>
                    </Form>
                  </div>
                </Modal>
              </div>

              <!--  -->
            </div>
          </section>
        </div>
      </div>

      <!-- 安全验证弹窗 -->
      <Modal
        class="detail"
        v-model="safeShow"
        width="480px"
        title="安全验证"
        :mask-closable="false"
        :footer-hide="true"
      >
        <div class="detail-list">
          <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            label-position="top"
          >
            <!-- 邮箱验证码 -->
            <div v-if="securityInfo.emailSetting[1] || safeType == 8">
              <div class="u-p-b-10" style="color: #9aa5b5">
                获取并输入邮箱 {{ securityInfo.email }} 收到的验证码
              </div>
              <FormItem :label="$t('uc.safe.emailcode')" prop="emailCode">
                <Input v-model="formValidate.emailCode" size="large">
                  <div class="timebox" slot="append">
                    <Button
                      @click="send(safeType, 'uCodeEmail', 'disabled')"
                      :disabled="formValidate.disabled"
                    >
                      <u-verification-code
                        ref="uCodeEmail"
                        :keep-running="false"
                        @change="
                          text => {
                            timeTips = text
                          }
                        "
                        @end="formValidate.disabled = false"
                      ></u-verification-code>
                      {{ timeTips }}
                    </Button>
                  </div>
                </Input>
              </FormItem>
            </div>
            <!-- 手机验证码 -->
            <div v-if="securityInfo.mobileSetting[1] || safeType == 7">
              <div class="u-p-b-10" style="color: #9aa5b5">
                获取并输入手机 {{ securityInfo.mobile }} 收到的验证码
              </div>
              <FormItem :label="$t('uc.safe.phonecode')" prop="mobileCode">
                <Input v-model="formValidate.mobileCode" size="large">
                  <div class="timebox" slot="append">
                    <Button
                      @click="send(safeType, 'uCodeMobile', 'disabled2')"
                      :disabled="formValidate.disabled2"
                    >
                      <u-verification-code
                        ref="uCodeMobile"
                        :keep-running="false"
                        @change="
                          text => {
                            timeTips200 = text
                          }
                        "
                        @end="formValidate.disabled2 = false"
                      ></u-verification-code>
                      {{ timeTips200 }}
                    </Button>
                  </div>
                </Input>
              </FormItem>
            </div>
            <!-- 谷歌验证码 -->
            <div v-if="securityInfo.googleSetting[1] || safeType == 9">
              <FormItem :label="$t('uc.safe.googlecode')" prop="googleAuthCode">
                <Input
                  v-model="formValidate.googleAuthCode"
                  size="large"
                ></Input>
              </FormItem>
            </div>
            <!-- Button -->
            <div class="u-text-right">
              <Button type="text" @click="safeShow = false">{{
                $t('uc.api.cancel')
              }}</Button>
              <Button
                type="primary"
                @click="handleSubmit('formValidate', safeType)"
                >{{ $t('common.ok') }}</Button
              >
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import {
  getCertification,
  certification,
  getSecurity,
  sendCode,
  setVerify,
  getCountryList,
  getGoogle,
  getUserInfo
} from '@/api/user'
import uVerificationCode from '@/components/u-verification-code/u-verification-code'
export default {
  components: {
    uVerificationCode
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('uc.safe.newpwdmsg1')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('uc.safe.newpwdmsg1')))
      } else {
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('uc.safe.newpwdmsg2')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('uc.safe.newpwdmsg2')))
      } else if (value !== this.formValidate4.newPw) {
        callback(new Error(this.$t('uc.safe.newpwdmsg2')))
      } else {
        callback()
      }
    }
    const validateMPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('uc.safe.pwdmsg1')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('uc.safe.pwdmsg1')))
      } else {
        callback()
      }
    }
    const validateMPassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('uc.safe.pwdmsg2')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('uc.safe.pwdmsg2')))
      } else if (value !== this.formValidate5.newMPw) {
        callback(new Error(this.$t('uc.safe.pwdmsg2')))
      } else {
        callback()
      }
    }
    const validatepw7 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('uc.safe.pwdmsg1')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('uc.safe.pwdmsg1')))
      } else {
        callback()
      }
    }
    const validatepw7check = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('uc.safe.pwdmsg1')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('uc.safe.pwdmsg2')))
      } else if (value !== this.formValidate7.pw7) {
        callback(new Error(this.$t('uc.safe.pwdmsg2')))
      } else {
        callback()
      }
    }
    const validateMPass8 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('uc.safe.pwdmsg1')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('uc.safe.pwdmsg1')))
      } else {
        callback()
      }
    }
    const validateMPassCheck8 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('uc.safe.pwdmsg2')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('uc.safe.pwdmsg2')))
      } else if (value !== this.formValidate8.newMPw8) {
        callback(new Error(this.$t('uc.safe.pwdmsg2')))
      } else {
        callback()
      }
    }
    return {
      // 倒计时文字
      timeTips: '',
      timeTips2: '',
      timeTips200: '',
      timeTips270: '',
      timeTips11: '',
      timeTips17: '',
      timeTips12: '',
      timeTips16: '',
      timeTips19: '',
      timeTips26: '',
      timeTips260: '',
      timeTips27: '',
      timeTips28: '',
      timeTips280: '',
      countryList: [], // 国家区列表
      realNameShow: false, // 实名认证弹窗
      realNameInfo: {}, // 实名认证详情
      userInfo: {}, // 用户信息
      // 安全认证详情
      securityInfo: {
        mobileSetting: [false, false, false],
        emailSetting: [false, false, false],
        googleSetting: [false, false, false],
        tradeSetting: [false],
        loginSetting: [true],
        mobile: '',
        email: ''
      },
      safeShow: false, // 安全验证弹窗
      safeType: '', // 安全验证类型
      emailShow: false, // 绑定邮箱弹窗
      editEemailShowa: false, // 更换邮箱 1
      editEemailShowb: false, // 更换邮箱 2
      mobileShow: false, // 绑定手机弹窗
      mobileShowa: false, // 更换手机 1
      mobileShowb: false, // 更换手机 2
      googleShow: false, // 谷歌验证器
      googleOnOffShow: false, // 开启关闭谷歌验证弹窗
      loginPsShow: false, // 登录密码弹窗
      capitalPsShow: false, // 资金密码弹窗
      capitalPsShowa: false, // 修改资金密码弹窗
      stepsKey: '', // 接口返回值

      fGetBackFundpwd: false,
      imgPreview: '',
      imgNext: '',
      imgLast: '',
      loginmsg: this.$t('common.logintip'),
      memberlevel: '',
      frontCardImg: require('../../assets/images/frontCardImg.png'),
      backCardImg: require('../../assets/images/backCardImg.png'),
      handCardImg: require('../../assets/images/HandCardImg.png'),

      uploadHeaders: { 'x-auth-token': localStorage.getItem('TOKEN') },
      uploadUrl: this.host + '/uc/upload/oss/image',

      usernameS: '',
      user: {},
      choseItem: 0,
      accountValue: '1',
      // 谷歌
      googleTit: '',
      googleLabel: '',
      googleType: '',
      formValidate10: {},
      googleValue: '',
      // 安全验证
      formValidate: {},
      // 邮箱
      formValidate2: {
        mail: '',
        vailCode1: '',
        password: ''
      },
      // 更换邮箱 - 第1步
      formValidate2a: {
        emailCode: ''
      },
      // 更换邮箱 - 第2步
      formValidate2b: {
        email: '',
        emailCode: ''
      },
      formValidate3: {
        stateCode: 1
      },
      formValidate3a: {},
      formValidate3b: {
        stateCode: 1
      },
      formGoogleOnOff: {},
      formValidate4: {
        newPw: '',
        newPwConfirm: ''
      },
      formValidate5: {
        oldPw: '',
        newMPw: '',
        newMPwConfirm: ''
        // vailCode5: '',
      },
      formValidate6: {
        realName: '',
        idCard: ''
      },
      formValidate7: {
        pw7: '',
        pw7Confirm: ''
      },
      formValidate8: {
        newMPw8: '',
        newMPwConfirm8: '',
        vailCode5: ''
      },
      ruleValidate: {
        googleAuthCode: [
          {
            required: true,
            message: '请输入谷歌验证码',
            trigger: 'blur'
          }
        ],
        mail: [
          {
            required: true,
            type: 'email',
            message: this.$t('uc.safe.emailtip'),
            trigger: 'blur'
          }
        ],
        emailCode: [
          {
            required: true,
            message: this.$t('uc.safe.codetip'),
            trigger: 'blur'
          }
        ],
        mobileCode: [
          {
            required: true,
            message: this.$t('uc.safe.codetip'),
            trigger: 'blur'
          }
        ],
        vailCode: [
          {
            required: true,
            message: this.$t('uc.safe.codetip'),
            trigger: 'blur'
          }
        ],
        vailCode1: [
          {
            required: true,
            message: this.$t('uc.safe.codetip'),
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: this.$t('uc.safe.telnotip'),
            trigger: 'blur'
          }
        ],
        country: [
          {
            required: true,
            message: this.$t('uc.regist.countrytip'),
            trigger: 'blur'
          }
        ],
        vailCode2: [
          {
            required: true,
            message: this.$t('uc.safe.codetip'),
            trigger: 'blur'
          }
        ],
        vailCode3: [
          {
            required: true,
            message: this.$t('uc.safe.codetip'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: this.$t('uc.safe.pwdmsg1'),
            trigger: 'blur'
          }
        ],
        oldPw: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: this.$t('uc.safe.oldpwdtip'),
            trigger: 'blur'
          }
        ],
        newPw: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: this.$t('uc.safe.newpwdmsg1'),
            trigger: 'blur'
          },
          { validator: validatePass, trigger: 'blur' }
        ],
        newPwConfirm: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: this.$t('uc.safe.newpwdmsg2'),
            trigger: 'blur'
          },
          { validator: validatePassCheck, trigger: 'blur' }
        ],
        newMPw: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: this.$t('uc.safe.pwdmsg1'),
            trigger: 'blur'
          },
          { validator: validateMPass, trigger: 'blur' }
        ],
        newMPwConfirm: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: this.$t('uc.safe.pwdmsg2'),
            trigger: 'blur'
          },
          { validator: validateMPassCheck, trigger: 'blur' }
        ],
        pw7: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: this.$t('uc.safe.pwdmsg1'),
            trigger: 'blur'
          },
          { validator: validatepw7, trigger: 'blur' }
        ],
        pw7Confirm: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: this.$t('uc.safe.pwdmsg2'),
            trigger: 'blur'
          },
          { validator: validatepw7check, trigger: 'blur' }
        ],
        vailCode5: [
          {
            required: true,
            message: this.$t('uc.safe.codetip'),
            trigger: 'blur'
          }
        ],
        realName: [
          {
            required: true,
            message: this.$t('uc.safe.realnametip'),
            trigger: 'blur'
          }
        ],
        idCard: [
          {
            required: true,
            message: this.$t('uc.safe.idcardtip'),
            trigger: 'blur'
          }
        ],
        newMPw8: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: this.$t('uc.safe.pwdmsg1'),
            trigger: 'blur'
          },
          { validator: validateMPass8, trigger: 'blur' }
        ],
        newMPwConfirm8: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: this.$t('uc.safe.pwdmsg2'),
            trigger: 'blur'
          },
          { validator: validateMPassCheck8, trigger: 'blur' }
        ]
      },
      time1: 60, // 发送验证码倒计时
      time2: 60, // 发送验证码倒计时
      time3: 60, // 发送验证码倒计时
      time5: 60, // 发送验证码倒计时
      safeEmailTime: 60,
      sendMsgDisabled1: false,
      sendMsgDisabled2: false,
      sendMsgDisabled3: false,
      sendMsgDisabled5: false
    }
  },
  created() {
    this.getUserInfo()
    this.getCountryList() // 查询国家地区区号
    this.getCertification() // 查询实名认证信息
    this.getSecurity() // 查询用户安全认证
    // this.getMember();
    // let level = this.$store.getters.member.memberRate;
    // level == 0 && (this.memberlevel = "普通会员");
    // level == 1 && (this.memberlevel = "超级群主");
    // level == 2 && (this.memberlevel = "超级合伙人");
  },
  methods: {
    /* 获取用户信息 */
    getUserInfo() {
      getUserInfo().then(res => {
        this.userInfo = res
      })
    },
    /* 开启、关闭谷歌验证 */
    onOff(type) {
      this.safeShow = true

      // 打开安全弹窗、重置倒计时
      this.$refs.uCodeEmail && this.$refs.uCodeEmail.reset()
      this.$refs.uCodeMobile && this.$refs.uCodeMobile.reset()

      this.safeType = type
      this.formValidate = {}
    },
    /* google */
    googleFn(type) {
      // 绑定谷歌验证
      if (type == 0) {
        this.googleTit = '绑定谷歌验证'
        this.googleLabel = '输入谷歌验证码'
        this.googleType = 12
      }
      // 更换谷歌验证
      else {
        this.googleTit = '更换谷歌验证'
        this.googleLabel = '输入新谷歌验证码'
        this.googleType = 18
      }
      this.googleShow = true
      getGoogle().then(res => {
        this.googleValue = res
      })
    },
    /* 绑定 */
    bindFn() {
      // 绑定前先验证
      // console.log(JSON.parse(JSON.stringify(this.securityInfo)))
      // this.safeShow = true
      // this.safeType = 10

      this.mobileShow = true
    },
    /* 获取谷歌认证 */
    getGoogle() {
      getGoogle().then(res => {
        this.googleValue = res
      })
    },
    /* 查询国家地区区号 */
    getCountryList() {
      getCountryList().then(res => {
        this.countryList = res
      })
    },
    /* 查询用户安全认证 */
    getSecurity() {
      getSecurity().then(res => {
        this.securityInfo = res
        // console.log('是否绑定手机', this.securityInfo.mobileSetting[0])

        // this.securityInfo.emailSetting[0] = false // 调试邮箱
      })
    },
    /* 查询实名认证信息 */
    getCertification() {
      getCertification().then(res => {
        this.realNameInfo = res
      })
    },
    /* 实名认证 */
    beforeUpload(data) {
      if (data && data.size >= 1024000 * 2) {
        this.$Message.error('上传图片大小不能超过2M')
        return false
      }
    },
    frontHandleSuccess(res, file, fileList) {
      this.$refs.upload1.fileList = [fileList[fileList.length - 1]]
      if (res.code == 0) {
        this.frontCardImg = this.imgPreview = res.data
      } else {
        this.$Message.error(res.message)
      }
    },
    backHandleSuccess(res, file, fileList) {
      this.$refs.upload2.fileList = [fileList[fileList.length - 1]]
      if (res.code == 0) {
        this.backCardImg = this.imgNext = res.data
      } else {
        this.$Message.error(res.message)
      }
    },
    handHandleSuccess(res, file, fileList) {
      this.$refs.upload3.fileList = [fileList[fileList.length - 1]]
      if (res.code == 0) {
        this.handCardImg = this.imgLast = res.data
      } else {
        this.$Message.error(res.message)
      }
    },
    noPhone() {
      this.$Message.info(this.$t('uc.safe.bindphonetip'))
      this.showItem(3)
    },
    /* 提交 */
    submit(name, type) {
      // console.log(type);
      switch (name) {
        // 安全验证
        case 'formValidate':
          setVerify({
            emailCode: this.formValidate.emailCode,
            mobileCode: this.formValidate.mobileCode,
            googleAuthCode: this.formValidate.googleAuthCode,
            stepsKey: this.stepsKey,
            verifyType: type
          }).then(() => {
            this.safeShow = false
            this.getSecurity()
            this.$Notice.success({
              title: '提示',
              desc: '成功'
            })
          })
          break
        // 实名认证
        case 'formValidate6':
          // console.log(JSON.parse(JSON.stringify(this.formValidate6)))
          // return
          certification({
            cardId: this.formValidate6.idCard,
            cardName: this.formValidate6.realName,
            auditLevel: 1,
            // 证件正面照片
            frontPage: 'dasdadas.jpg',
            // 证件反面照片
            backPage: 'dadfsfsdf.jpg',
            // 手持证件照片
            holdPage: 'dadfsfsdf.jpg',
            // 国家/地区
            country: '中国',
            // 国家/地区——CODE
            countryId: 1,
            // 证件类型
            type: 1
          }).then(() => {
            this.realNameShow = false
            this.getSecurity()
            this.$Notice.success({
              title: '提示',
              desc: '提交成功'
            })
          })
          break
        // 修改登录密码
        case 'formValidate4':
          setVerify({
            password: this.formValidate4.newPw,
            mobileCode: this.formValidate4.mobileCode,
            emailCode: this.formValidate4.emailCode,
            googleAuthCode: this.formValidate4.googleAuthCode,
            verifyType: 27
          }).then(() => {
            this.loginPsShow = false
            this.$Notice.success({
              title: '提示',
              desc: '成功'
            })
            this.getSecurity()
          })
          break
        // 绑定谷歌
        case 'formValidate10':
          setVerify({
            googleAuthSecretKey: this.googleValue,
            googleAuthCode: this.formValidate10.googleAuthCode,
            verifyType: type
          }).then(res => {
            // 绑定谷歌
            if (type == 12) {
              this.stepsKey = res
              this.googleShow = false
              this.safeShow = true
              this.safeType = 15
            }
            // 更换谷歌
            else if (type == 18) {
              // 成功弹出 - 安全验证(手机验证或谷歌验证)
              this.stepsKey = res
              this.googleShow = false
              this.safeShow = true
              this.safeType = 24
            }
          })
          break
        // 更换邮箱 第1步
        case 'formValidate2a':
          if (this.formValidate2a.vailCode1 == '') {
            this.$refs.formValidate2a.validateField('vailCode1')
          }
          setVerify({
            emailCode: this.formValidate2a.vailCode1,
            verifyType: 17
          }).then(res => {
            // 保存返回值，第2步使用
            this.stepsKey = res
            // 成功弹出第二步
            // console.log(this.stepsKey);
            this.editEemailShowa = false
            this.editEemailShowb = true // 弹出第2步
          })
          break
        // 更换邮箱 第2步
        case 'formValidate2b':
          setVerify({
            email: this.formValidate2b.mail,
            emailCode: this.formValidate2b.vailCode1,
            stepsKey: this.stepsKey,
            verifyType: 20
          }).then(res => {
            this.stepsKey = res
            // 成功弹出 - 安全验证(手机验证或谷歌验证)
            this.editEemailShowb = false
            this.safeShow = true
            this.safeType = 23
          })
          break
        // 绑定邮箱
        case 'formValidate2':
          setVerify({
            email: this.formValidate2.mail,
            emailCode: this.formValidate2.vailCode1,
            // stepsKey: this.stepsKey,
            verifyType: 11
          }).then(res => {
            this.emailShow = false

            this.safeShow = true
            this.stepsKey = res
            this.safeType = 14
          })
          break
        // 绑定手机
        case 'formValidate3':
          setVerify({
            stateCode: this.formValidate3.stateCode,
            mobile: this.formValidate3.mobile,
            mobileCode: this.formValidate3.vailCode2,
            verifyType: 10
          }).then(res => {
            this.mobileShow = false

            this.safeShow = true
            this.stepsKey = res
            this.safeType = 13
          })
          break
        // 更换手机 - 第1步
        case 'formValidate3a':
          setVerify({
            mobileCode: this.formValidate3a.vailCode2,
            verifyType: 16
          }).then(res => {
            this.mobileShowa = false
            this.mobileShowb = true
            this.stepsKey = res
            this.$Notice.success({
              title: '提示',
              desc: '成功'
            })
          })
          break
        // 更换手机 - 第2步
        case 'formValidate3b':
          setVerify({
            stateCode: this.formValidate3b.stateCode,
            mobile: this.formValidate3b.mobile,
            mobileCode: this.formValidate3b.vailCode2,
            stepsKey: this.stepsKey,
            verifyType: 19
          }).then(res => {
            this.stepsKey = res
            // 成功弹出 - 安全验证(手机验证或谷歌验证)
            this.mobileShowb = false
            this.safeShow = true
            this.safeType = 22
          })
          break
        // 设置资金密码
        case 'formValidate7':
          setVerify({
            password: this.formValidate7.pw7,
            mobileCode: this.formValidate7.mobileCode,
            emailCode: this.formValidate7.emailCode,
            googleAuthCode: this.formValidate7.googleAuthCode,
            verifyType: type
          }).then(() => {
            this.capitalPsShow = false
            this.capitalPsShowa = false
            this.formValidate7 = {}
            this.$Notice.success({
              title: '提示',
              desc: '成功'
            })
            this.getSecurity()
          })
          break
      }
    },
    handleSubmit(name, type = 0) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.submit(name, type)
        } else {
          // this.$Message.error(this.$t("uc.safe.save_failure"));
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    },
    showItem(index) {
      this.choseItem = index
    },
    /* 发送验证码 */
    send(index, countName, disName, formName) {
      switch (true) {
        // 安全验证
        case index == 8 || // 开启邮箱验证
          index == 3 || // 关闭邮箱验证
          index == 15 || // 绑定谷歌验证
          index == 24 || // 更换谷歌验证 - 第2步
          index == 5 || // 关闭谷歌验证
          index == 9 || // 开启谷歌验证
          index == 14 || // 绑定邮箱 - 第2步
          index == 13 || // 绑定手机 - 第2步
          index == 23 || // 更换邮箱 - 第3步
          index == 22 || // 更换手机 - 第3步
          index == 7 || // 开启手机验证
          index == 1: // 关闭手机验证
          // 开始倒计时、禁用button
          countName && this.$refs[countName].start()
          disName && (this.formValidate[disName] = true)
          formName && (this[formName].disabled = true)
          sendCode({
            verifyType: index,
            isMobile: countName == 'uCodeEmail' ? false : true
          })
            .then(() => {
              this.$Notice.success({
                title: '提示',
                desc: '成功'
              })
            })
            .catch(() => {
              // 接口报错重置
              countName && this.$refs[countName].reset()
              disName && (this.formValidate[disName] = false)
              formName && (this[formName].disabled = false)
            })
          break
        // 更换手机 - 第1步
        case index == 16:
          // 开始倒计时、禁用button
          countName && this.$refs[countName].start()
          formName && (this[formName].disabled = true)
          sendCode({
            verifyType: 16,
            isMobile: true
          })
            .then(() => {
              this.$Notice.success({
                title: '提示',
                desc: '成功'
              })
            })
            .catch(() => {
              // 接口报错重置
              countName && this.$refs[countName].reset()
              formName && (this[formName].disabled = false)
            })
          break
        // 更换手机 - 第2步
        case index == 19:
          if (!this.formValidate3b.mobile) {
            this.$refs.formValidate3b.validateField('mobile')
            return
          }
          // 开始倒计时、禁用button
          countName && this.$refs[countName].start()
          formName && (this[formName].disabled = true)
          sendCode({
            stateCode: this.formValidate3b.stateCode,
            mobile: this.formValidate3b.mobile,
            verifyType: 19,
            isMobile: true
          })
            .then(() => {
              this.$Notice.success({
                title: '提示',
                desc: '成功'
              })
            })
            .catch(() => {
              // 接口报错重置
              countName && this.$refs[countName].reset()
              formName && (this[formName].disabled = false)
            })
          break

        // 绑定邮箱 - 第1步
        case index == 11:
          if (!this.formValidate2.mail) {
            this.$refs.formValidate2.validateField('mail')
            return
          }
          countName && this.$refs[countName].start()
          formName && (this[formName].disabled = true)
          sendCode({
            email: this.formValidate2.mail,
            verifyType: 11,
            isMobile: false
          })
            .then(() => {
              this.$Notice.success({
                title: '提示',
                desc: '成功'
              })
            })
            .catch(() => {
              countName && this.$refs[countName].reset()
              formName && (this[formName].disabled = false)
            })
          break
        // 更换邮箱 - 第1步
        case index == 17:
          countName && this.$refs[countName].start()
          formName && (this[formName].disabled = true)
          sendCode({
            verifyType: 17,
            isMobile: false
          }).then(() => {
            this.$Notice.success({
              title: '提示',
              desc: '成功'
            })
          })
          break
        // 更换邮箱 - 第2步
        case index == 20:
          if (!this.formValidate2b.mail) {
            this.$refs.formValidate2b.validateField('mail')
            return
          }
          countName && this.$refs[countName].start()
          formName && (this[formName].disabled = true)
          sendCode({
            // 新邮箱
            email: this.formValidate2b.mail,
            verifyType: 20,
            isMobile: false
          })
            .then(() => {
              this.formValidate2b.disabled = true
              this.$refs.uCode12.start()
              this.$Notice.success({
                title: '提示',
                desc: '成功'
              })
            })
            .catch(() => {
              countName && this.$refs[countName].reset()
              formName && (this[formName].disabled = false)
            })
          break
        // 绑定手机 第1步
        case index == 2:
          // if (this.formValidate3.mobile == '') {
          //   this.$refs.formValidate3.validateField("mobile");
          //   return
          // }
          countName && this.$refs[countName].start()
          formName && (this[formName].disabled = true)
          sendCode({
            stateCode: this.formValidate3.stateCode,
            mobile: this.formValidate3.mobile,
            verifyType: 10,
            isMobile: true
          })
            .then(() => {
              this.$Notice.success({
                title: '提示',
                desc: '成功'
              })
            })
            .catch(() => {
              countName && this.$refs[countName].reset()
              formName && (this[formName].disabled = false)
            })
          break

        // 修改登录密码邮箱验证、手机验证
        case index == 27:
          // 开始倒计时、禁用button
          countName && this.$refs[countName].start()
          disName && (this.formValidate[disName] = true)
          formName && (this[formName].disabled = true)
          sendCode({
            verifyType: 27,
            isMobile: countName == 'uCode27' ? false : true
          })
            .then(() => {
              this.$Notice.success({
                title: '提示',
                desc: '成功'
              })
            })
            .catch(() => {
              // 接口报错重置
              countName && this.$refs[countName].reset()
              disName && (this.formValidate[disName] = false)
              formName && (this[formName].disabled = false)
            })
          break
        // 设置资金密码
        case index == 26:
          // 开始倒计时、禁用button
          countName && this.$refs[countName].start()
          disName && (this.formValidate[disName] = true)
          formName && (this[formName].disabled = true)
          sendCode({
            verifyType: 26,
            isMobile: countName == 'uCode26' ? false : true
          })
            .then(() => {
              this.$Notice.success({
                title: '提示',
                desc: '成功'
              })
            })
            .catch(() => {
              // 接口报错重置
              countName && this.$refs[countName].reset()
              disName && (this.formValidate[disName] = false)
              formName && (this[formName].disabled = false)
            })
          break
        // 修改资金密码
        case index == 28:
          // 开始倒计时、禁用button
          countName && this.$refs[countName].start()
          disName && (this.formValidate[disName] = true)
          formName && (this[formName].disabled = true)
          sendCode({
            verifyType: 28,
            isMobile: countName == 'uCode28' ? false : true
          })
            .then(() => {
              this.$Notice.success({
                title: '提示',
                desc: '成功'
              })
            })
            .catch(() => {
              // 接口报错重置
              countName && this.$refs[countName].reset()
              disName && (this.formValidate[disName] = false)
              formName && (this[formName].disabled = false)
            })
          break
      }
    },
    getMember() {
      //获取个人安全信息
      var self = this
      this.$http
        .post(this.host + '/uc/approve/security/setting')
        .then(response => {
          var resp = response.body
          if (resp.code == 0) {
            this.user = resp.data
            this.usernameS = this.user.username.slice(0, 1)
          } else {
            this.$Message.error(this.loginmsg)
            // this.$Message.error(this.$t('common.logintip'));
          }
        })
    }
  },
  computed: {
    member: function () {
      return this.$store.getters.member
    },
    lang() {
      return this.$store.state.lang
    }
  }
}
</script>



<style lang="scss" scoped>
// 去除表单必填时，显示红色 * 号
// ::v-deep .ivu-form-item-required .ivu-form-item-label:before {
//   content: "" !important;
//   margin-right: 0;
// }
// ::v-deep .ivu-modal-header {
//   border-bottom: none;
// }

.security-wrap {
  background-color: #F2F6FD;
}
.security-con {
  width: 1200px;
  margin: 0 auto;
}

.idcard-desc {
  p {
    padding: 6px 0;
  }
}


button.ivu-btn {
  &:focus {
    box-shadow: 0 0 0 2px rgba(45, 140, 240, 0);
  }
}
button.ivu-btn.ivu-btn-primary {
  box-shadow: 0 0 0 2px rgba(45, 140, 240, 0);
}
.nav-right {
  padding-left: 15px;
  .user .user-top-icon {
    height: 80px;
    border-bottom: 1px dashed #27313e;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 50px;
  }
}
.uploadimgtip {
  position: relative;
  top: -20px;
  color: #2d8cf0;
}
.account-box .account-in .account-item .account-detail {
  padding: 30px 0;
  // background: white;
  margin: 6px 0;
}

.account-box .account-in .account-item .account-detail .detail-list {
  width: 40%;
  margin: 0 auto;
}

.account-box
  .account-in
  .account-item
  .account-detail
  .detail-list
  .input-control {
  margin-bottom: 10px;
  height: 45px;
}

.detail-list .input-control .ivu-input-group-prepend {
  width: 63px;
}

.detail-list .input-control .ivu-input {
  height: 45px;
}

.account-box .account-in .account-item {
  margin-bottom: 10px;
}

.account-box .account-in .account-item .account-item-in {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 15px 30px 15px 50px;
  // background-color: white;
  -webkit-box-shadow: 0 1px 0 0 rgba(69, 112, 128, 0.06);
  box-shadow: 0 1px 0 0 rgba(69, 112, 128, 0.06);
  font-size: 14px;
  color: #fff;
}

.account-item-in .right {
  width: 100%;
}

.account-box .account-in .account-item .account-item-in .icons {
  height: 17px;
  width: 17px;
  display: inline-block;
  margin-top: -1px;
  background-size: 100% 100%;
}

.account-box .account-in .account-item .account-item-in .yesImg {
  background-image: url(../../assets/img/overicon.png);
}

.icons.noImg {
  background-image: url(../../assets/img/noicon.png);
}

.account-box .account-in .account-item .account-item-in .card-number {
  width: 142px;
  height: 40px;
  margin-right: 15px;
  border-right: 1px dashed #27313e;
  padding: 0 15px;
  line-height: 40px;
  text-align: left;
  display: inline-block;
}

.account-box .account-in .account-item .account-item-in .bankInfo {
  width: 70%;
  text-align: left;
}

.account-box .account-in .account-item .account-item-in .btn {
  cursor: pointer;
}

.tips-g {
  color: #8994a3;
  font-size: 12px;
}

.gr {
  color: #b4b4b4;
}

.m1 {
  display: inline-block;
  width: 25px;
  height: 25px;
  background: url(../../assets/img/m1.png);
  background-size: 100% 100%;
  vertical-align: middle;
  margin-right: 5px;
}

.m2 {
  display: inline-block;
  width: 25px;
  height: 25px;
  background: url(../../assets/img/m2.png);
  background-size: 100% 100%;
  vertical-align: middle;
  margin-right: 5px;
}

.m3 {
  display: inline-block;
  width: 25px;
  height: 25px;
  background: url(../../assets/img/m3.png);
  background-size: 100% 100%;
  vertical-align: middle;
  margin-right: 5px;
}

.itp {
  display: inline-block;
}

.user-right {
  width: 80%;
}

.rightarea {
  padding-left: 15px !important;
  padding-right: 15px !important;
  margin-bottom: 60px !important;
}

.rightarea .rightarea-top {
  line-height: 75px;
  border-bottom: #f1f1f1 solid 1px;
}

.rightarea .trade-process {
  line-height: 30px;
  padding: 0 15px;
  background: #f1f1f1;
  display: inline-block;
  position: relative;
  margin-right: 20px;
}

.rightarea .trade-process.active {
  color: #eb6f6c;
  background: #f9f5eb;
}

.rightarea .trade-process .icon {
  background: #fff;
  border-radius: 20px;
  height: 20px;
  width: 20px;
  display: inline-block;
  line-height: 20px;
  text-align: center;
  margin-right: 10px;
}

.rightarea .trade-process .arrow {
  position: absolute;
  top: 10px;
  right: -5px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid #f1f1f1;
}

.rightarea .trade-process.active .arrow {
  border-left: 5px solid #f9f5eb;
}

.rightarea .rightarea-tabs {
  border: none;
}

.rightarea .rightarea-tabs li > a {
  width: 100%;
  height: 100%;
  padding: 0;
  margin-right: 0;
  font-size: 14px;
  color: #646464;
  border-radius: 0;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rightarea .rightarea-tabs li > a:hover {
  background-color: #fcfbfb;
}

.rightarea .rightarea-tabs li {
  width: 125px;
  height: 40px;
  position: relative;
  margin: -1px 0 0 -1px;
  border: 1px solid #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.rightarea .rightarea-tabs li.active {
  background-color: #fcfbfb;
}

.rightarea .rightarea-tabs li:last-child {
  border-right: 1px solid #f1f1f1;
}

.rightarea .rightarea-tabs li.active > a,
.rightarea .rightarea-tabs li:hover > a {
  color: #da2e22;
  border: none;
}

.rightarea .panel-tips {
  border: 3px solid #fdfaf3;
  color: #9e9e9e;
  font-size: 12px;
}

.rightarea .panel-tips .panel-header {
  background: #fdfaf3;
  line-height: 40px;
  margin-bottom: 15px;
}

.rightarea .panel-tips .panel-title {
  font-size: 16px;
}

.rightarea .recordtitle {
  cursor: pointer;
}

.user .top-icon {
  width: 75px;
  height: 75px;
  display: inline-block;
}

.user .top-icon.intro {
  background-position: 0 -670px;
}

.user .user-info {
  padding: 0px 10px;
  background-color: #fff;
  color: #fff;
}

.user .user-info .user-info-top {
  border-bottom: 1px dashed #27313e;
  padding-bottom: 20px;
}

.user .user-info h5 {
  font-size: 18px;
}

.user .user-info h5 .iconfont {
  font-size: 20px;
  color: #e24a64;
  margin-left: 10px;
}

.user-avatar {
  display: flex;
  justify-content: space-between;
}

.user-icons {
  display: flex;
  align-self: center;
  width: 300px;
}

.user-icons .icons-in {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  background-color: #00b5f6;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
}

.user-icons .icons-in em {
  color: white;
  font-size: 20px;
  font-style: normal;
}

.user-icons .user-name {
  margin-left: 10px;
  display: flex;
  justify-content: flex-start;
  /* align-items: center; */
  flex-direction: column;
}

.user-icons .user-name span {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 225px;
  height: 52px;
  overflow: hidden;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}

.user-top-icon .trade-info {
  width: 420px;
  padding-left: 30px;
  display: flex;
}

.user-top-icon .trade-info .item {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.user-top-icon .trade-info .item.capital {
  width: 60%;
}

.user-icons .user-name span.uid {
  color: #8994a3;
  font-size: 12px;
}

.circle-info {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 80px;
  width: 80px;
  border-radius: 50%;
  border: 2px solid #ebeff5;
  margin-left: 14px;
}

.circle-info span {
  font-weight: bolder;
}

.circle-info p {
  color: #8994a3;
  margin: 0;
  padding: 0;
}

.circle-info p.count {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.user-avatar-public {
  background: #eee;
  border-radius: 50%;
  height: 52px;
  width: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 5px 0 rgba(71, 78, 114, 0.24);
  position: relative;
}

.user-avatar-public > .user-avatar-in {
  background: #2d8cf0;
  border-radius: 50%;
  height: 42px;
  width: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
</style>
