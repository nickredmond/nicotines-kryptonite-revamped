<div ng-show="errorMessage" class="alert alert-danger pageErrorsDiv">
  <h4>{{ errorMessage }}</h4>
</div>
<div ng-show="infoMessage" class="alert alert-info">
  <h4>{{ infoMessage }}</h4>
</div>
<form>
    <h3>Update your quit date</h3>
  <div class="input-group user-form-control">
    <span class="input-group-addon">Date</span>
    <input type="date" class="form-control datepicker" placeholder="yyyy-MM-dd" ng-model="dateQuit.date" />
  </div>
  <div class="input-group user-form-control">
    <span class="input-group-addon">Time</span>
    <input type="time" placeholder="HH:mm:ss" class="form-control" ng-model="dateQuit.time" />
  </div>
  <div>
    <h3>Update your tobacco prices <small>(So we know how much youll save)</small></h3>
    <div ng-show="cigarettePrice" class="input-group user-form-control">
      <span class="input-group-addon">Cigarette Price (per pack)</span>
      <input type="text" class="form-control" ng-model="cigarettePrice" />
    </div>
    <div ng-show="dipPrice" class="input-group user-form-control">
      <span class="input-group-addon">Smokeless Price (per can/tin)</span>
      <input type="text" class="form-control" ng-model="dipPrice" />
    </div>
    <div ng-show="cigarPrice" class="input-group user-form-control">
      <span class="input-group-addon">Cigar Price</span>
      <input type="text" class="form-control"ng-model="cigarPrice" />
    </div>
  </div>
</form>
<form>
  <h3>{{ financialGoalTitle }}</h3>
  <p><small>Tell us what you would like to spend the money on that youll save from not buying tobacco!</small></p>
  <div class="input-group user-form-control">
    <span class="input-group-addon">Item</span>
    <input type="text" class="form-control" ng-model="financialGoalItem" placeholder="Example: 'A new car'" />
  </div>
  <div class="input-group user-form-control">
    <span class="input-group-addon">Cost</span>
    <input type="text" class="form-control" ng-model="financialGoalCost" />
  </div>
</form>
<div id="updateUsageContentArea">
  <legend>Update Nicotine Usage</legend>
  <table id="usageUpdateTable">
    <tr>
      <td>Date Used</td>
      <td>Nicotine Type</td>
      <td>Quantity Used</td>
    </tr>
    <tr ng-repeat="usage in usageInfos">
      <td>
        <input ng-model="usage.date" type="date" class="form-control datepicker" placeholder="yyyy-MM-dd" />
      </td>
      <td> 
        <select ng-model="usage.nicotineType" class="form-control">
          <option>Cigarettes</option>
          <option>Smokeless Tobacco</option>
          <option>Cigars</option>
          <!--<option>Nicotine Gum</option>-->
          <option>Nicotine Lozenges</option>
          <!--<option>Nicotine Patches</option>-->
          <!--<option>Electronic Cigarettes</option>-->
        </select>
      </td>
      <td>
        <input type="text" class="form-control" ng-model="usage.quantity" />
      </td>
    </tr>
  </table>
  <button class="btn btn-small btn-primary pull-right" ng-click="addUsageInfo()"><span class="glyphicon glyphicon-plus"></span>Add Usage Info</button>
</div>
<button id="updateProfileButton" class="btn btn-primary formButton" ng-click="updateProfile()">Update Profile</button>