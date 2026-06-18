from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def linear_regression_model(x_train_scaled,y_train):
    model=LinearRegression()
    model.fit(x_train_scaled,y_train)
    return model


def decision_tree_model(x_train,y_train, max_depth=5):
    model=DecisionTreeRegressor(max_depth=max_depth,random_state=42)
    model.fit(x_train,y_train)
    return model

def random_forest_model(x_train,y_train,max_depth=6):
    model=RandomForestRegressor(max_depth=max_depth,random_state=42)
    model.fit(x_train,y_train,)
    return model

def gradient_boosting_regressor(x_train,y_train,):
    model=GradientBoostingRegressor()  #n_estimators=100,
    # learning_rate=0.1,
    # max_depth=3,
    # random_state=42
    model.fit(x_train,y_train,)
    return model

def model_evaluation(model,x_test_scaled,y_test,model_name: str)->dict:
    prediction=model.predict(x_test_scaled)
    mae=mean_absolute_error(y_test,prediction)
    rmse=mean_squared_error(y_test,prediction, )**0.5
    r2=r2_score(y_test,prediction)*100

    print(f"\n{model_name} performance:")
    print(f"mae =  {mae:.2f}")
    print(f"rmse =  {rmse:.2f}")
    print(f"R2 =  {r2:.2f}%")

    return{
        "model_name": model_name,
        "mae": mae,
        "rmse": rmse,
        "R2": r2
    }


def select_best_model(results):
    for r in results:
        r["score"] = (r["R2"] / 100) - (r["rmse"] / 1000)

    return max(results, key=lambda x: x["score"])
 


