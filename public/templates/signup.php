<div ng-show="registrationErrors.length > 0" class="alert alert-danger pageErrorsDiv">
<h4 ng-repeat="error in registrationErrors" class="errorMessage">{{ error }}</h4>
</div>
<form ng-submit="signup()">
<div ng-show="getSignupPage() === 'Intro'" class="panel panel-primary">
  <div class="panel-heading">
    <h3 class="panel-title">Before we begin...</h3>
  </div>
  <div class="panel-body">
    Some text...
    <button class="signupButton btn btn-primary pull-right" ng-click="goNextPage('Info')">Next</button>
  </div>
</div>

<div ng-show="getSignupPage() === 'Info'" class="panel panel-primary">
  <div class="panel-heading">
    <h3 class="panel-title">First, lets get to know you!</h3><!-- TODO: add apostophre -->
  </div>
  <div class="panel-body">
    <input ng-model="user.name" type="text" class="form-control user-form-control" placeholder="Your Name" />
    <div class="input-group user-form-control">
      <span class="input-group-addon">Birthdate</span>
      <input type="date" class="form-control user-form-control datepicker" placeholder="yyyy-MM-dd" ng-model="user.birthdate" />
    </div>
    <div class="input-group user-form-control">
      <span class="input-group-addon">State of Residence</span>
      <select id="stateSelect" class="form-control"
              ng-model="user.stateOfResidence"></select>
    </div>
    <div class="input-group user-form-control">
      <span class="input-group-addon">How You Plan on Quitting</span>
      <select ui-select2 ng-change="quittingMethodSelected(method)" class="form-control" ng-model="method">
        <option ng-repeat="method in quittingMethods">{{ method }}</option>
      </select>
    </div>
    <div class="input-group user-form-control" ng-show="nrtBrands && nrtBrands.length > 0">
      <span class="input-group-addon">Nicotine Brand</span>
      <select class="form-control" ng-model="user.nrtBrand">
        <option ng-repeat="brand in nrtBrands">{{ brand }}</option>
      </select>
    </div>
    <div class="input-group">
      <h5>What type(s) of tobacco products do you use regularly?</h5>
      <div class="checkbox" ng-repeat="tobaccoType in tobaccoTypes">
        <label>
          <input type="checkbox" 
                 value="{{tobaccoType}}" 
                 ng-click="toggleTobaccoSelection(tobaccoType)" />{{ tobaccoType }}
        </label>
      </div>
    </div>
    <button class="signupButton btn btn-primary pull-right" ng-click="goNextPage('Addiction')">Next</button>
  </div>
</div>

<div ng-show="getSignupPage() === 'Addiction'" class="panel panel-primary">
  <div class="panel-heading">
    <h3 class="panel-title">Wed like to know about your addiction</h3>
  </div>
  <div class="panel-body">
    <input type="text" 
           class="form-control user-form-control"
           ng-model="user.cigarettesPerDay"
           ng-show="user.selectedTobaccoTypes.indexOf('Cigarettes') > -1"
           placeholder="Cigarettes smoked per day" />
    <input type="text" 
           class="form-control user-form-control"
           ng-model="user.dipsPerDay"
           ng-show="user.selectedTobaccoTypes.indexOf('Smokeless Tobacco') > -1"
           placeholder="Dips/Pouches taken per day" />
     <input type="text" 
           class="form-control user-form-control"
           ng-model="user.cigarsPerDay"
           ng-show="user.selectedTobaccoTypes.indexOf('Cigars') > -1"
           placeholder="Cigars smoked per day" />
    <div class="input-group user-form-control" 
         ng-show="user.selectedTobaccoTypes.indexOf('Cigarettes') > -1">
      <span class="input-group-addon">Cigarette Brand</span>
      <select id="cigaretteBrands" class="form-control"
              ng-model="user.cigaretteBrand"></select>
    </div>
    <div class="input-group user-form-control"
         ng-show="user.selectedTobaccoTypes.indexOf('Smokeless Tobacco') > -1">
      <span class="input-group-addon">Smokeless Brand</span>
      <select id="smokelessBrands" class="form-control"
              ng-model="user.dipBrand"></select>
    </div>
    <div class="input-group user-form-control"
         ng-show="user.selectedTobaccoTypes.indexOf('Cigars') > -1">
      <span class="input-group-addon">Cigar Brand</span>
      <select id="cigarBrands" class="form-control"
              ng-model="user.cigarBrand"></select>
    </div>
    <button class="signupButton btn btn-primary pull-right" ng-click="goNextPage('Account')">Next</button>
  </div>
</div>

<div ng-show="getSignupPage() === 'Account'" class="panel panel-primary">
  <div class="panel-heading">
    <h3 class="panel-title">Now lets finalize your account!</h3>
  </div>
  <div class="panel-body">
    <input type="text" class="form-control user-form-control" placeholder="Username"
           ng-model="user.username" />
    <input type="text" class="form-control user-form-control" placeholder="Email"
           ng-model="user.email" />
    <input type="password" class="form-control user-form-control" placeholder="Password"
           ng-model="user.password" />
    <input type="password" class="form-control user-form-control" placeholder="Confirm Password"
           ng-model="user.passwordConfirmation" />
    <button class="signupButton btn btn-primary pull-right" ng-click="register()">Register!</span>
  </div>
</div>
</form>