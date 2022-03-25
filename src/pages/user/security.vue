<template>
  <div class="page-wrap">
    <div class="page-con u-p-t-20 u-p-b-20">
      <div class="header u-font-14 u-flex u-row-between u-col-bottom">
        <div class="left u-flex">
          <div class="icon-wrap">
            <Icon type="md-person" size="38" />
          </div>
          <div class="u-p-l-10">
            <div class="user-name u-flex">
              <span class="u-font-20">{{ certificationInfo && certificationInfo.cardName || userInfo.username }}</span>
              <span class="u-m-l-20">UID: {{ userInfo.uuid }}</span>
            </div>
            <p class="user-ip u-p-t-6">
              <span class="u-p-r-10">IP:xxxxx</span>
              <span class="u-link" onclick="alert('目前没有接口支持！')">{{ $t('security.ckaq') }}</span>
            </p>
          </div>
        </div>
        <div class="right u-font-12">{{ $t('security.zhdl') }} xxxxxx</div>
      </div>
      <!-- 身份认证 -->
      <div
        class="certification u-m-t-20 u-p-20 u-flex u-row-between u-col-bottom"
      >
        <div>
          <h2>{{ $t('security.sfrz') }}</h2>
          <p class="u-p-t-6">
            {{ $t('security.wcsf') }}
          </p>
          <div class="u-p-t-10">
            <span class="u-link" v-if="certificationInfo && certificationInfo.level == 1">
              <Icon type="md-checkmark-circle" size="14" />
              实名认证
            </span>
            <span
              class="u-link"
              @click="realNameShow = true"
              v-if="!certificationInfo || certificationInfo.level == 0"
            >
              <Icon type="md-close-circle" size="14" />
              实名认证
            </span>
          </div>
        </div>
        <!-- 未认证 -->
        <p v-if="!certificationInfo">
          <span class="u-link" @click="realNameShow = true">去认证</span>
        </p>
        <!-- 实名认证 [0:待审核,1:审核中,2:审核通过,3:审核失败] -->
        <p v-if="certificationInfo && certificationInfo.state === 0">
          <span>{{ $t('security.dsh') }}</span>
        </p>
        <p v-if="certificationInfo && certificationInfo.state === 1">
          <span>{{ $t('security.shz') }}</span>
        </p>
        <!-- 审核未通过 -->
        <p v-if="certificationInfo && certificationInfo.state === 3">
          <Poptip trigger="hover" word-wrap width="200">
            <div slot="content" class="u-p-10">
              {{ certificationInfo.remark }}
            </div>
            <span class="u-link" @click="realNameShow = true">
            {{ $t('security.shwtg') }}</span
          >
          </Poptip>
        </p>

        <!-- 实名认证弹窗 -->
        <Modal
          class="detail"
          v-model="realNameShow"
          width="700px"
          :title="$t('security.smrz')"
          :mask-closable="false"
          :footer-hide="true"
        >
          <div class="detail-list" style="width: 100%">
            <Form
              ref="formValidate6"
              :model="formValidate6"
              :rules="ruleValidate"
              :label-width="85"
            >
              <FormItem label="国家" prop="country">
                <Select v-model="formValidate6.country" filterable size="large">
                  <Option v-for="(item, index) in countryList" :value="item.code.toString() + '-' + item.name" :key="index">{{ item.name }}</Option>
                </Select>
              </FormItem>
              <FormItem label="证件类型" prop="type">
                <Select v-model="formValidate6.type" size="large">
                  <Option v-for="item in typeList" :value="item.value.toString()" :key="item.value">{{ item.name }}</Option>
                </Select>
              </FormItem>
              <!-- 真实姓名 -->
              <FormItem :label="$t('security.xm')" prop="cardName">
                <Input v-model="formValidate6.cardName" size="large"></Input>
              </FormItem>
              <!-- 身份证号 -->
              <FormItem label="证件号码" prop="cardId">
                <Input v-model="formValidate6.cardId" size="large"></Input>
              </FormItem>
              <div style="height: 220px" class="u-text-center">
                <Row>
                  <Col span="8">
                    <input type="hidden" name="imgPreview" :value="imgPreview" />
                    <div class="idcard-title">
                      证件正面照
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
                        :show-upload-list="false"
                      >
                        <Button icon="ios-cloud-upload-outline">{{ $t('security.djsc') }}</Button>
                      </Upload>
                    </div>
                  </Col>
                  <Col span="8">
                    <input type="hidden" name="imgNext" :value="imgNext" />
                    <div class="idcard-title">
                      证件反面照
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
                        :show-upload-list="false"
                      >
                        <Button icon="ios-cloud-upload-outline">{{ $t('security.djsc') }}</Button>
                      </Upload>
                    </div>
                  </Col>
                  <Col span="8">
                    <input type="hidden" name="imgLast" :value="imgLast" />
                    <div class="idcard-title">
                      手持证件与个人签名照
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
                        :show-upload-list="false"
                      >
                        <Button icon="ios-cloud-upload-outline">{{ $t('security.djsc') }}</Button>
                      </Upload>
                    </div>
                  </Col>
                </Row>
              </div>
              <div class="idcard-desc u-text-left">
                <p>{{ $t('security.zcjpg') }}</p>
                <p>{{ $t('security.zpxmg') }}</p>
                <p>{{ $t('security.xyts') }}</p>
              </div>
              <div class="u-text-right">
                <Button type="text" @click="realNameShow = false">{{ $t('publice.qx') }}</Button>
                <Button
                  type="primary"
                  @click="handleSubmit('formValidate6')"
                  class="u-m-l-8"
                  >{{ $t('publice.qd') }}</Button
                >
              </div>
            </Form>
          </div>
        </Modal>
      </div>

      <div class="card-box u-m-t-20">
        <h2>{{ $t('security.scsf') }}</h2>
        <ul class="list-wrap">
          <!-- 邮箱 -->
          <li>
            <div class="u-flex">
              <Icon type="ios-mail" size="28" color="#faad14" />
              <div class="text u-p-l-14">
                <h3 class="u-m-b-4">{{ $t('security.yx') }}</h3>
                <p>
                  {{ $t('security.yydl') }}
                </p>
              </div>
            </div>
            <!-- 已绑定 -->
            <div v-if="securityInfo.emailSetting[0]">
              <span>{{ securityInfo.email }}</span>
              <span class="u-link u-m-l-20" @click="editEemailShowa = true"
                >{{ $t('security.ghyx') }}</span
              >
              <span
                class="u-link u-m-l-20"
                @click="onOff(3)"
                v-if="securityInfo.emailSetting[1]"
                >{{ $t('security.gbyz') }}</span
              >
              <span class="u-link u-p-l-20" @click="onOff(8)" v-else
                >{{ $t('security.kqyz') }}</span
              >
            </div>
            <!-- 未绑定 -->
            <div v-else>
              <span class="u-link" @click="emailShow = true">{{ $t('security.bding') }}</span>
            </div>

            <!-- 更换邮箱 - 第1步 -->
            <Modal
              class="detail"
              v-model="editEemailShowa"
              width="480px"
              :title="$t('security.ghyx')"
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
                    {{ $t('security.hqbs') }} {{ securityInfo.email }} {{ $t('security.sddy') }}
                  </div>
                  <FormItem :label="$t('security.yxyzm')" prop="vailCode1">
                    <Input v-model="formValidate2a.vailCode1" size="large">
                      <div class="timebox" slot="append">
                        <Button
                          type="text"
                          size="default"
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
                      >{{ $t('publice.qx') }}</Button
                    >
                    <Button
                      type="primary"
                      @click="handleSubmit('formValidate2a')"
                      class="u-m-l-8"
                      >{{ $t('publice.qd') }}</Button
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
              :title="$t('security.ghyx')"
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
                  <div class="u-p-b-16">{{ $t('security.ghyxh') }}</div>
                  <FormItem :label="$t('security.xyx')" prop="mail">
                    <Input v-model="formValidate2b.mail" size="large"></Input>
                  </FormItem>
                  <FormItem :label="$t('security.yxyzm')" prop="vailCode1">
                    <Input v-model="formValidate2b.vailCode1" size="large">
                      <div class="timebox" slot="append">
                        <Button
                          type="text"
                          size="default"
                          @click="send(20, 'uCode12', '', 'formValidate2b')"
                          :disabled="formValidate2b.disabled"
                        >
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
                      $t('publice.qx')
                    }}</Button>
                    <Button
                      type="primary"
                      @click="handleSubmit('formValidate2b')"
                      class="u-m-l-8"
                      >{{ $t('publice.qd') }}</Button
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
              :title="$t('security.bdyx')"
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
                  <FormItem :label="$t('security.yx')" prop="mail">
                    <Input v-model="formValidate2.mail" size="large"></Input>
                  </FormItem>
                  <FormItem :label="$t('security.yxyzm')" prop="vailCode1">
                    <Input v-model="formValidate2.vailCode1" size="large">
                      <div class="timebox" slot="append">
                        <Button
                          type="text"
                          size="default"
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
                    <Button type="text" @click="emailShow = false">{{ $t('publice.qx') }}</Button>
                    <Button
                      type="primary"
                      @click="handleSubmit('formValidate2')"
                      class="u-m-l-8"
                      >{{ $t('publice.qd') }}</Button
                    >
                  </div>
                </Form>
              </div>
            </Modal>
          </li>
          <!-- 手机 -->
          <li>
            <div class="u-flex">
              <Icon type="ios-call" size="28" color="#367de1" />
              <div class="text u-p-l-14">
                <h3 class="u-m-b-4">{{ $t('security.sjhm') }}</h3>
                <p>
                  {{ $t('security.yydl') }}
                </p>
              </div>
            </div>
            <!-- 已绑定 -->
            <div v-if="securityInfo.mobileSetting[0]">
              <span>{{ securityInfo.mobile }}</span>
              <span class="u-link u-m-l-20" @click="mobileShowa = true"
                >{{ $t('security.ghsj') }}</span
              >
              <span
                class="u-link u-m-l-20"
                @click="onOff(1)"
                v-if="securityInfo.mobileSetting[1]"
                >{{ $t('security.gbyz') }}</span
              >
              <span class="u-link u-p-l-20" @click="onOff(7)" v-else
                >{{ $t('security.kqyz') }}</span
              >
            </div>
            <!-- 未绑定 -->
            <div v-else>
              <span class="u-link" @click="bindFn">{{ $t('security.bding') }}</span>
            </div>

            <!-- 绑定手机 -->
            <Modal
              class="detail"
              v-model="mobileShow"
              width="480px"
              :title="$t('security.bdsj')"
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
                    :title="$t('security.sjhm')"
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
                  <!-- 手机验证码 -->
                  <FormItem :label="$t('security.sjyzm')" prop="vailCode2">
                    <Input v-model="formValidate3.vailCode2" size="large">
                      <div class="timebox" slot="append">
                        <Button
                          size="default"
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
                  <div class="u-text-right">
                    <Button type="text" @click="mobileShow = false">{{
                      $t('publice.qx')
                    }}</Button>
                    <Button
                      type="primary"
                      @click="handleSubmit('formValidate3')"
                      >{{ $t('publice.qd') }}</Button
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
              :title="$t('security.ghsj')"
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
                    {{ $t('security.hqsrsj') }} {{ securityInfo.mobile }} {{ $t('security.sddyzm') }}
                  </div>
                  <FormItem :label="$t('security.sjyzm')" prop="vailCode2">
                    <Input v-model="formValidate3a.vailCode2" size="large">
                      <div class="timebox" slot="append">
                        <Button
                          type="text"
                          size="default"
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
                  <div class="u-text-right">
                    <Button type="text" @click="mobileShowa = false"
                      >{{ $t('publice.qx') }}</Button
                    >
                    <Button
                      type="primary"
                      @click="handleSubmit('formValidate3a')"
                      class="u-m-l-8"
                      >{{ $t('publice.qd') }}</Button
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
              :title="$t('security.ghsj')"
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
                    :label="$t('security.sjhm')"
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
                  <FormItem :label="$t('security.sjyzm')" prop="vailCode2">
                    <Input v-model="formValidate3b.vailCode2" size="large">
                      <div class="timebox" slot="append">
                        <Button
                          size="default"
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
                  <div class="u-text-right">
                    <Button type="text" @click="mobileShowb = false">{{
                      $t('publice.qx')
                    }}</Button>
                    <Button
                      type="primary"
                      @click="handleSubmit('formValidate3b')"
                      >{{ $t('publice.qd') }}</Button
                    >
                  </div>
                </Form>
              </div>
            </Modal>
          </li>
          <li>
            <div class="u-flex">
              <Icon type="logo-google" size="28" color="#367de1" />
              <div class="text u-p-l-14">
                <h3 class="u-m-b-4">{{ $t('security.ggyz') }}</h3>
                <p>
                  {{ $t('security.yydl') }}
                </p>
              </div>
            </div>
            <!-- 已绑定 -->
            <div v-if="securityInfo.googleSetting[0]">
              <span class="u-link u-m-l-20" @click="googleFn(1)"
                >{{ $t('security.ghgg') }}</span
              >
              <span
                class="u-link u-m-l-20"
                @click="onOff(9)"
                v-if="!securityInfo.googleSetting[1]"
                >{{ $t('security.kqyz') }}</span
              >
              <span class="u-link u-m-l-20" @click="onOff(5)" v-else
                >{{ $t('security.gbyz') }}</span
              >
            </div>
            <!-- 未绑定 -->
            <div v-else>
              <span class="u-link" @click="googleFn(0)">{{ $t('security.bdgg') }}</span>
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
                    {{ $t('security.qzsj') }}
                  </p>
                  <p>
                   {{ $t('security.azwc') }}
                  </p>
                  <div class="u-p-b-20 u-text-center">
                    <!-- <qrcode-vue :value="googleValue"></qrcode-vue> -->
                    <div class="u-font-20 u-p-t-20">{{ googleValue }}</div>
                    <Button class="u-m-t-10" icon="md-copy" v-clipboard="() => googleValue" v-clipboard:success="copySuccess">复制秘钥</Button>
                  </div>
                  <p>
                    {{ $t('security.tjcg') }}
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
                      $t('publice.qx')
                    }}</Button>
                    <Button
                      type="primary"
                      @click="handleSubmit('formValidate10', googleType)"
                      >{{ $t('publice.qd') }}</Button
                    >
                  </div>
                </Form>
              </div>
            </Modal>
          </li>
        </ul>
      </div>

      <div class="card-box u-m-t-20">
        <h2>{{ $t('security.aqma') }}</h2>
        <ul class="list-wrap">
          <!-- 登录密码 -->
          <li>
            <div class="u-flex">
              <Icon type="ios-lock" size="28" color="#faad14" />
              <div class="text u-p-l-14">
                <h3 class="u-m-b-4">{{ $t('security.dlma') }}</h3>
                <p>{{ $t('security.yybh') }}</p>
              </div>
            </div>
            <div>
              <!-- 修改 -->
              <span
                class="u-link"
                @click="loginPsShow = true"
                v-if="securityInfo.mobileSetting[0]"
                >{{ $t('security.xg') }}</span
              >
              <!-- 先绑定手机 -->
              <span class="u-link" @click="noPhone" v-else>{{ $t('security.xg') }}</span>
            </div>

            <!-- 修改登录密码 -->
            <Modal
              class="detail"
              v-model="loginPsShow"
              width="480px"
              :title="$t('security.xgdlma')"
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
                  <FormItem :label="$t('security.xdlma')" prop="newPw">
                    <Input
                      v-model="formValidate4.newPw"
                      size="large"
                      type="password"
                    ></Input>
                  </FormItem>
                  <!-- newPwConfirm -->
                  <FormItem
                    :label="$t('security.qrxmm')"
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
                      {{ $t('security.hqbs') }} {{ securityInfo.email }} {{ $t('security.sddy') }}
                    </div>
                    <FormItem :label="$t('security.yxyzm')" prop="emailCode">
                      <Input v-model="formValidate4.emailCode" size="large">
                        <div class="timebox" slot="append">
                          <Button
                            size="default"
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
                      {{ $t('security.hqbsr') }} {{ securityInfo.mobile }} {{ $t('security.sddy') }}
                    </div>
                    <FormItem
                      :label="$t('security.sjyzm')"
                      prop="mobileCode"
                    >
                      <Input v-model="formValidate4.mobileCode" size="large">
                        <div class="timebox" slot="append">
                          <Button
                            size="default"
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
                      :label="$t('security.ggyzm')"
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
                      $t('publice.qx')
                    }}</Button>
                    <Button
                      type="primary"
                      @click="handleSubmit('formValidate4', googleType)"
                      >{{ $t('publice.qd') }}</Button
                    >
                  </div>
                </Form>
              </div>
            </Modal>
          </li>
          <!-- 资金密码 -->
          <li>
            <div class="u-flex">
              <Icon type="logo-bitcoin" size="28" color="#367de1" />
              <div class="text u-p-l-14">
                <h3 class="u-m-b-4">{{$t('security.zjmm')}}</h3>
                <p>{{$t('security.yybhzc')}}</p>
              </div>
            </div>
            <div>
              <span
                class="u-link"
                @click="capitalPsShow = true"
                v-if="!securityInfo.tradeSetting[0]"
                >{{$t('security.sz')}}</span>
              <span class="u-link" @click="capitalPsShowa = true" v-else>{{$t('security.xg')}}</span>
            </div>

            <!-- 设置资金密码 -->
            <Modal
              v-model="capitalPsShow"
              width="480px"
              :title="$t('security.szzj')"
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
                  <FormItem :label="$t('security.zjmm')" prop="pw7">
                    <Input
                      v-model="formValidate7.pw7"
                      size="large"
                      type="password"
                    ></Input>
                  </FormItem>
                  <!-- newPwConfirm -->
                  <FormItem :label="$t('security.qrmm')" prop="pw7Confirm">
                    <Input
                      v-model="formValidate7.pw7Confirm"
                      size="large"
                      type="password"
                    ></Input>
                  </FormItem>
                  <!-- 邮箱验证码 -->
                  <div v-if="securityInfo.emailSetting[1]">
                    <div class="u-p-b-10" style="color: #9aa5b5">
                      {{ $t('security.hqbs') }} {{ securityInfo.email }} {{ $t('security.sddy') }}
                    </div>
                    <FormItem :label="$t('security.yxyzm')" prop="emailCode">
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
                      {{ $t('security.hqbsr') }} {{ securityInfo.mobile }} {{ $t('security.sddy') }}
                    </div>
                    <FormItem
                      :label="$t('security.sjyzm')"
                      prop="mobileCode"
                    >
                      <Input v-model="formValidate7.mobileCode" size="large">
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
                      :label="$t('security.ggyzm')"
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
                      $t('publice.qx')
                    }}</Button>
                    <Button
                      type="primary"
                      @click="handleSubmit('formValidate7', 26)"
                      >{{ $t('publice.qd') }}</Button
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
                  :title="$t('security.xgzjmm')"
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
                      <FormItem :label="$t('security.zjmm')" prop="pw7">
                        <Input
                          v-model="formValidate7.pw7"
                          size="large"
                          type="password"
                        ></Input>
                      </FormItem>
                      <!-- newPwConfirm -->
                      <FormItem
                        :label="$t('security.qrmm')"
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
                          {{$t('security.hqbs')}} {{ securityInfo.email }} {{$t('security.sddy')}}
                        </div>
                        <FormItem
                          :label="$t('security.yxyzm')"
                          prop="emailCode"
                        >
                          <Input v-model="formValidate7.emailCode" size="large">
                            <div class="timebox" slot="append">
                              <Button
                                size="default"
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
                          {{$t('security.hqbsr')}} {{ securityInfo.mobile }} {{$t('security.sddy')}}
                        </div>
                        <FormItem
                          :label="$t('security.sjyzm')"
                          prop="mobileCode"
                        >
                          <Input
                            v-model="formValidate7.mobileCode"
                            size="large"
                          >
                            <div class="timebox" slot="append">
                              <Button
                                size="default"
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
                          :label="$t('security.ggyz')"
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
                          $t('publice.qx')
                        }}</Button>
                        <Button
                          type="primary"
                          @click="handleSubmit('formValidate7', 28)"
                          >{{ $t('publice.qd') }}</Button
                        >
                      </div>
                    </Form>
                  </div>
                </Modal>
          </li>
        </ul>
      </div>
    </div>

    <!-- 安全验证 -->
    <safeModal v-model="safeShow" :loading="submitLoading" :safeType="safeType" @submit="safeSubmit"></safeModal>

  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
  certification,
  certificationEdit,
  sendCode,
  setVerify,
  getCountryList,
  getGoogle
} from '@/api/user'
import uVerificationCode from '@/components/u-verification-code/u-verification-code'
import safeModal from '@/components/safeModal/safeModal'
export default {
  components: {
    uVerificationCode,
    safeModal
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('security.mmbnwk')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('security.bxy6')))
      } else {
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('security.mmbnwk')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('security.bxy6')))
      } else if (value !== this.formValidate4.newPw) {
        callback(new Error(this.$t('security.mmbyz')))
      } else {
        callback()
      }
    }
    const validateMPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('security.mmbnwk')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('security.bxy6')))
      } else {
        callback()
      }
    }
    const validateMPassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('security.mmbnwk')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('security.bxy6')))
      } else if (value !== this.formValidate5.newMPw) {
        callback(new Error(this.$t('security.mmbyz')))
      } else {
        callback()
      }
    }
    const validatepw7 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('security.mmbnwk')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('security.bxy6')))
      } else {
        callback()
      }
    }
    const validatepw7check = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('security.mmbnwk')))
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t('security.bxy6')))
      } else if (value !== this.formValidate7.pw7) {
        callback(new Error(this.$t('security.mmbyz')))
      } else {
        callback()
      }
    }
    
    return {
      typeList: [
        { value: 1, name: '身份证'},
        { value: 2, name: '护照'},
        { value: 3, name: '驾驶证'},
        { value: 0, name: '其他'},
      ],
      submitLoading: false,
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
      safeShow: false, // 安全验证弹窗
      safeType: 0, // 安全验证类型
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
      memberlevel: '',
      frontCardImg: require('../../assets/images/frontCardImg.png'),
      backCardImg: require('../../assets/images/backCardImg.png'),
      handCardImg: require('../../assets/images/HandCardImg.png'),

      uploadHeaders: { 'Authorization': 'Bearer ' + localStorage.token },
      uploadUrl: this.host + '/admin/sys-file/upload',

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
        country: '',
        type: '',
        cardName: '',
        cardId: ''
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
            message: '请输入邮箱',
            trigger: 'blur'
          }
        ],
        emailCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ],
        mobileCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ],
        vailCode1: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }
        ],
        vailCode2: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: '请输入不小于6位密码',
            trigger: 'blur'
          }
        ],
        newPw: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: '请输入不小于6位新登录密码',
            trigger: 'blur'
          },
          { validator: validatePass, trigger: 'blur' }
        ],
        newPwConfirm: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: '密码不一致',
            trigger: 'blur'
          },
          { validator: validatePassCheck, trigger: 'blur' }
        ],
        newMPw: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: '请输入不小于6位密码',
            trigger: 'blur'
          },
          { validator: validateMPass, trigger: 'blur' }
        ],
        newMPwConfirm: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: '密码不一致',
            trigger: 'blur'
          },
          { validator: validateMPassCheck, trigger: 'blur' }
        ],
        pw7: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: '请输入不小于6位密码',
            trigger: 'blur'
          },
          { validator: validatepw7, trigger: 'blur' }
        ],
        pw7Confirm: [
          {
            required: true,
            type: 'string',
            min: 6,
            message: '密码不一致',
            trigger: 'blur'
          },
          { validator: validatepw7check, trigger: 'blur' }
        ],
        vailCode5: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ],
        country: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        cardName: [
          {
            required: true,
            message: '请输入真实姓名',
            trigger: 'blur'
          }
        ],
        cardId: [
          {
            required: true,
            message: '请输入身份证号码',
            trigger: 'blur'
          }
        ],
      },
      time1: 60, // 发送验证码倒计时
      time2: 60, // 发送验证码倒计时
      time3: 60, // 发送验证码倒计时
      time5: 60, // 发送验证码倒计时
      safeEmailTime: 60,
      sendMsgDisabled1: false,
      sendMsgDisabled2: false,
      sendMsgDisabled3: false,
      sendMsgDisabled5: false,
    }
  },
  created() {
    this.getCountryList() // 查询国家地区区号
    this.getCertification()
  },
  computed: {
    ...mapState(['userInfo', 'securityInfo', 'certificationInfo']),
  },
  methods: {
    ...mapActions(['getSecurity', 'getCertification']),
    /* 复制地址 */
    copySuccess() {
      this.$Notice.success({
        title: '提示',
        desc: "复制成功"
      })
    },
    /* 提示用户下载App */
    toDownloadApp() {
      this.$Notice.info({
        title: '提示',
        desc: '后期改成提示用户下载App完成高级认证'
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
    /* 图片上传前 */
    beforeUpload(data) {
      if (data && data.size >= 1024000 * 2) {
        this.$Message.error('上传图片大小不能超过2M')
        return false
      }
    },
    frontHandleSuccess(res, file, fileList) {
      // this.$refs.upload1.fileList = [fileList[fileList.length - 1]]
      if (res.code == 0) {
        this.frontCardImg = this.imgPreview = res.data.url
      } else {
        this.$Message.error(res.message)
      }
    },
    backHandleSuccess(res, file, fileList) {
      // this.$refs.upload2.fileList = [fileList[fileList.length - 1]]
      if (res.code == 0) {
        this.backCardImg = this.imgNext = res.data.url
      } else {
        this.$Message.error(res.message)
      }
    },
    handHandleSuccess(res, file, fileList) {
      // this.$refs.upload3.fileList = [fileList[fileList.length - 1]]
      if (res.code == 0) {
        this.handCardImg = this.imgLast = res.data.url
      } else {
        this.$Message.error(res.message)
      }
    },
    noPhone() {
      this.$Message.info('请先绑定手机!')
      this.showItem(3)
    },
    /* 安全验证提交 */
    safeSubmit(name, type, formData) {
      this.submitLoading = true
      setVerify({
        stepsKey: this.stepsKey,
        verifyType: type,
        ...formData
      }).then(() => {
        this.safeShow = false
        this.getSecurity()
        this.$Notice.success({
          title: '提示',
          desc: '成功'
        })
      }).finally(() => {
        this.submitLoading = false
      })
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
          // state == 3 被驳回调另一个接口
          let request = this.certificationInfo.state == 3 ? certificationEdit : certification
          request({
            // 认证级别[0:未认证,1:基础认证,2:视频认证]，初次认证：默认1
            level: 1,
            // 国家/地区
            country: this.formValidate6.country.split('-')[1],
            // 国家/地区——CODE
            countryId: this.formValidate6.country.split('-')[0],
            // 证件类型
            type: this.formValidate6.type,
            // 证件名
            cardName: this.formValidate6.cardName,
            // 证件号
            cardId: this.formValidate6.cardId,
            // 证件正面照片
            frontPage: this.frontCardImg,
            // 证件反面照片
            backPage: this.backCardImg,
            // 手持证件照片
            holdPage: this.handCardImg,
          }).then(() => {
            this.$Notice.success({
              title: '提示',
              desc: '提交成功'
            })
            this.realNameShow = false
            this.getCertification()
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
  }
}
</script>

<style lang="scss" scoped>
.page-wrap {
  background-color: #f2f6fd;
  min-height: 100vh;
}
.page-con {
  width: 1200px;
  margin: 0 auto;
  .header {
    background-color: #fff;
    border-radius: 7px;
    padding: 30px 20px;
    .left {
      .icon-wrap {
        width: 54px;
        height: 54px;
        line-height: 54px;
        background: #eee;
        border-radius: 54px;
        text-align: center;
      }
      .user-name {
        span + span {
          padding: 0 10px;
          height: 22px;
          line-height: 22px;
          text-align: center;
          background: rgba(0, 122, 255, 0.1);
          border-radius: 22px;
          color: #007aff;
        }
      }
    }
    .right {
      color: #999;
    }
  }
  .certification {
    background-color: #fff;
    border-radius: 7px;
    h2 {
      font-size: 16px;
    }
  }
  .card-box {
    background-color: #fff;
    border-radius: 7px;
    overflow: hidden;
    h2 {
      font-size: 16px;
      background-color: #f8fafd;
      border-radius: 7px 7px 0 0;
      padding: 20px;
    }
    .list-wrap {
      border-radius: 7px 7px 0 0;
      margin-top: -7px;
      background-color: #fff;
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
      }
      li:last-child {
        border-bottom: none;
        border-radius: 0 0 7px 7px;
      }
      .text {
        p {
          color: #999;
        }
      }
    }
  }
}
</style>