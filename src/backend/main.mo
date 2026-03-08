import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type SocialPlatform = {
    #twitter;
    #linkedin;
    #instagram;
    #reddit;
    #facebook;
    #youtube;
    #tiktok;
  };

  type ContentType = {
    #text;
    #images;
    #video;
    #links;
  };

  type EngagementStyle = {
    #creator;
    #commenter;
    #sharer;
    #lurker;
  };

  type PostingFrequency = {
    #daily;
    #weekly;
    #monthly;
    #rarely;
  };

  type TalentCategory = {
    #analytical;
    #creative;
    #leadership;
    #communication;
    #technical;
    #entrepreneurial;
    #empathetic;
    #strategic;
  };

  type TalentScore = {
    category : TalentCategory;
    score : Nat;
    insight : Text;
  };

  type SocialProfile = {
    name : Text;
    platform : SocialPlatform;
    topics : [Text];
    contentTypes : [ContentType];
    engagementStyle : EngagementStyle;
    postingFrequency : PostingFrequency;
    interests : [Text];
  };

  type AnalysisResult = {
    id : Nat;
    profile : SocialProfile;
    talentScores : [TalentScore];
    topCategories : [TalentCategory];
    timestamp : Int;
    labelText : ?Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let analyses = Map.empty<Nat, AnalysisResult>();
  let analysisOwners = Map.empty<Nat, Principal>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextId = 1;

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  func getScoreRange(score : Nat) : Text {
    if (score >= 80) { return "high" };
    if (score >= 60) { return "strong" };
    if (score >= 40) { return "moderate" };
    if (score >= 20) { return "developing" };
    "beginner";
  };

  func termMatches(topics : [Text], target : Text) : Bool {
    for (topic in topics.values()) {
      if (topic.toLower().contains(#text(target))) {
        return true;
      };
    };
    false;
  };

  func scoreCategory(profile : SocialProfile, category : TalentCategory) : TalentScore {
    switch (category) {
      case (#analytical) {
        var score = 0;
        if (termMatches(profile.topics, "science") or termMatches(profile.topics, "data") or termMatches(profile.topics, "research") or termMatches(profile.topics, "finance")) {
          score += 20;
        };

        switch (profile.engagementStyle) {
          case (#commenter) { score += 20 };
          case (#creator) { score += 10 };
          case (_) {};
        };

        switch (profile.postingFrequency) {
          case (#daily or #weekly) { score += 20 };
          case (#monthly) { score += 10 };
          case (_) {};
        };

        {
          category = #analytical;
          score;
          insight = "You have a " # getScoreRange(score) # " analytical talent based on your interests and engagement patterns.";
        };
      };
      case (#creative) {
        var score = 0;
        if (termMatches(profile.topics, "art") or termMatches(profile.topics, "design") or termMatches(profile.topics, "photography") or termMatches(profile.topics, "music") or termMatches(profile.topics, "writing")) {
          score += 15;
        };

        for (content in profile.contentTypes.values()) {
          if (content == #images or content == #video or content == #text) {
            score += 10;
          };
        };

        switch (profile.engagementStyle) {
          case (#creator) { score += 20 };
          case (_) {};
        };

        {
          category = #creative;
          score;
          insight = "Your creative talent is " # getScoreRange(score) # " according to your interests and content types.";
        };
      };
      case (#leadership) {
        var score = 0;
        if (termMatches(profile.topics, "business") or termMatches(profile.topics, "management") or termMatches(profile.topics, "politics")) {
          score += 15;
        };
        switch (profile.engagementStyle) {
          case (#creator) { score += 20 };
          case (_) {};
        };
        switch (profile.postingFrequency) {
          case (#daily) { score += 20 };
          case (_) {};
        };
        {
          category = #leadership;
          score;
          insight = "Your leadership potential is " # getScoreRange(score) # " based on your chosen topics and engagement.";
        };
      };
      case (#communication) {
        var score = 0;
        for (content in profile.contentTypes.values()) {
          if (content == #text) { score += 20 };
        };
        if (termMatches(profile.topics, "news") or termMatches(profile.topics, "writing") or termMatches(profile.topics, "storytelling")) {
          score += 15;
        };

        switch (profile.postingFrequency) {
          case (#daily or #weekly) { score += 15 };
          case (_) {};
        };
        {
          category = #communication;
          score;
          insight = "You have a " # getScoreRange(score) # " communication talent reflected in your content choices.";
        };
      };
      case (#technical) {
        var score = 0;
        if (termMatches(profile.topics, "coding") or termMatches(profile.topics, "tech") or termMatches(profile.topics, "engineering") or termMatches(profile.topics, "ai")) {
          score += 15;
        };

        switch (profile.engagementStyle) {
          case (#creator or #commenter) { score += 15 };
          case (_) {};
        };
        {
          category = #technical;
          score;
          insight = "Your technical aptitude is " # getScoreRange(score) # " based on your interests and engagement.";
        };
      };
      case (#entrepreneurial) {
        var score = 0;
        if (termMatches(profile.topics, "startup") or termMatches(profile.topics, "business") or termMatches(profile.topics, "marketing")) {
          score += 15;
        };
        switch (profile.engagementStyle) {
          case (#creator) { score += 15 };
          case (_) {};
        };

        switch (profile.postingFrequency) {
          case (#daily or #weekly) { score += 10 };
          case (_) {};
        };
        {
          category = #entrepreneurial;
          score;
          insight = "Your entrepreneurial spirit registers as " # getScoreRange(score) # " in this assessment.";
        };
      };
      case (#empathetic) {
        var score = 0;
        switch (profile.engagementStyle) {
          case (#commenter or #sharer) { score += 15 };
          case (_) {};
        };
        if (termMatches(profile.topics, "mental health") or termMatches(profile.topics, "relationships") or termMatches(profile.topics, "community")) {
          score += 15;
        };
        {
          category = #empathetic;
          score;
          insight = "Your empathy is rated as " # getScoreRange(score) # " based on your interests and engagement style.";
        };
      };
      case (#strategic) {
        var score = 0;
        if (termMatches(profile.topics, "strategy") or termMatches(profile.topics, "planning") or termMatches(profile.topics, "chess") or termMatches(profile.topics, "investing")) {
          score += 15;
        };
        switch (profile.engagementStyle) {
          case (#commenter) { score += 10 };
          case (_) {};
        };
        switch (profile.postingFrequency) {
          case (#weekly or #monthly) { score += 5 };
          case (_) {};
        };
        {
          category = #strategic;
          score;
          insight = "Your strategic thinking ranks as " # getScoreRange(score) # " based on your profile analysis.";
        };
      };
    };
  };

  func getCategoryOrder(category : TalentCategory) : Nat {
    switch (category) {
      case (#analytical) { 0 };
      case (#creative) { 1 };
      case (#leadership) { 2 };
      case (#communication) { 3 };
      case (#technical) { 4 };
      case (#entrepreneurial) { 5 };
      case (#empathetic) { 6 };
      case (#strategic) { 7 };
    };
  };

  module TalentScore {
    public func compare(score1 : TalentScore, score2 : TalentScore) : Order.Order {
      Nat.compare(score2.score, score1.score);
    };
  };

  func getTopCategories(scores : [TalentScore]) : [TalentCategory] {
    let sorted = scores.sort();
    let topCount = Nat.min(sorted.size(), 3);
    Array.tabulate<TalentCategory>(topCount, func(i) { sorted[i].category });
  };

  public shared ({ caller }) func submitAnalysis(profile : SocialProfile, labelText : ?Text) : async AnalysisResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit analyses");
    };

    let talentScores = List.fromArray<TalentScore>([#analytical, #creative, #leadership, #communication, #technical, #entrepreneurial, #empathetic, #strategic].map(func(category) { scoreCategory(profile, category) }));

    let scoresArray = talentScores.toArray();
    let topCategories = getTopCategories(scoresArray);

    let result : AnalysisResult = {
      id = nextId;
      profile;
      talentScores = scoresArray;
      topCategories;
      timestamp = Time.now();
      labelText;
    };

    analyses.add(nextId, result);
    analysisOwners.add(nextId, caller);
    nextId += 1;
    result;
  };

  public query ({ caller }) func getAnalysis(id : Nat) : async AnalysisResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view analyses");
    };

    switch (analyses.get(id)) {
      case (null) { Runtime.trap("Analysis not found") };
      case (?analysis) {
        // Check ownership: user can only view their own analyses, admins can view all
        switch (analysisOwners.get(id)) {
          case (null) { Runtime.trap("Analysis owner not found") };
          case (?owner) {
            if (caller != owner and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Can only view your own analyses");
            };
            analysis;
          };
        };
      };
    };
  };

  public query ({ caller }) func listAnalyses() : async [AnalysisResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list analyses");
    };

    // Admins can see all analyses, regular users only see their own
    if (AccessControl.isAdmin(accessControlState, caller)) {
      analyses.values().toArray();
    } else {
      let userAnalyses = List.empty<AnalysisResult>();
      for ((id, analysis) in analyses.entries()) {
        switch (analysisOwners.get(id)) {
          case (?owner) {
            if (owner == caller) {
              userAnalyses.add(analysis);
            };
          };
          case (null) {};
        };
      };
      userAnalyses.toArray();
    };
  };

  public shared ({ caller }) func deleteAnalysis(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete analyses");
    };

    if (not analyses.containsKey(id)) {
      Runtime.trap("Analysis not found");
    };

    // Check ownership: user can only delete their own analyses, admins can delete any
    switch (analysisOwners.get(id)) {
      case (null) { Runtime.trap("Analysis owner not found") };
      case (?owner) {
        if (caller != owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own analyses");
        };
        analyses.remove(id);
        analysisOwners.remove(id);
      };
    };
  };

  public query ({ caller }) func getTalentCategoryOrder(category : TalentCategory) : async Nat {
    getCategoryOrder(category);
  };

  public shared ({ caller }) func createSeeds() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create seeds");
    };

    if (analyses.isEmpty()) {
      let user1Profile : SocialProfile = {
        name = "Alice";
        platform = #twitter;
        topics = ["science", "data", "technology"];
        contentTypes = [#text, #images];
        engagementStyle = #commenter;
        postingFrequency = #daily;
        interests = ["photography", "cooking"];
      };

      let user2Profile : SocialProfile = {
        name = "Bob";
        platform = #linkedin;
        topics = ["business", "management", "entrepreneurship"];
        contentTypes = [#text];
        engagementStyle = #creator;
        postingFrequency = #weekly;
        interests = ["sports", "music"];
      };

      // Create seed analyses owned by the admin
      let talentScores1 = List.fromArray<TalentScore>([#analytical, #creative, #leadership, #communication, #technical, #entrepreneurial, #empathetic, #strategic].map(func(category) { scoreCategory(user1Profile, category) }));
      let scoresArray1 = talentScores1.toArray();
      let topCategories1 = getTopCategories(scoresArray1);
      let result1 : AnalysisResult = {
        id = nextId;
        profile = user1Profile;
        talentScores = scoresArray1;
        topCategories = topCategories1;
        timestamp = Time.now();
        labelText = ?("Science Enthusiast");
      };
      analyses.add(nextId, result1);
      analysisOwners.add(nextId, caller);
      nextId += 1;

      let talentScores2 = List.fromArray<TalentScore>([#analytical, #creative, #leadership, #communication, #technical, #entrepreneurial, #empathetic, #strategic].map(func(category) { scoreCategory(user2Profile, category) }));
      let scoresArray2 = talentScores2.toArray();
      let topCategories2 = getTopCategories(scoresArray2);
      let result2 : AnalysisResult = {
        id = nextId;
        profile = user2Profile;
        talentScores = scoresArray2;
        topCategories = topCategories2;
        timestamp = Time.now();
        labelText = ?("Business Professional");
      };
      analyses.add(nextId, result2);
      analysisOwners.add(nextId, caller);
      nextId += 1;
    } else { 
      Runtime.trap("Map is not empty. Seeds should only be created when map is empty.") 
    };
  };
};
