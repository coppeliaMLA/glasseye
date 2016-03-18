count<-c(4, 12, 44, 16)
N<-sum(count)
prop<-count/N

#Classical
sd_func<-function(p){
 return( sqrt((p*(1-p)/N)))
}
c_sd<-sapply(prop, sd_func)
c_u<-prop+1.96*c_sd
c_l<-prop-1.96*c_sd
plot(prop, ylim=c(-1,1))
points(c_u, col="Pink")
points(c_l, col="Pink")

#Note for reference only - doesn't really work as proportions are not independent in this case
#Bonferroni (mean test only)
bc_u<-prop+qnorm(1-(0.025/6))*c_sd
bc_l<-prop-qnorm(1-(0.025/6))*c_sd

points(bc_u, col="Green")
points(bc_l, col="Green")

#Bonferroni (all comparisons)

comb <- function(n, x) {
  return(factorial(n) / (factorial(x) * factorial(n-x)))
}

comb(6,2)

bc_u<-prop+qnorm(1-(0.025/15))*c_sd
bc_l<-prop-qnorm(1-(0.025/15))*c_sd

points(bc_u, col="Blue")
points(bc_l, col="Blue")

#Bayesian

dir<-count+1 #with non informative dir prior
bayesian<-dir/sum(dir)
#plot(prop, ylim=c(-0.2,0.5))

points(bayesian, col="red", pch=6)

a_0<-sum(dir)

bayes_sd<-function(a){
  var_a<-(a*(a_0-a))/(a_0^2*(a_0+1))
  return(sqrt(var_a))
}


b_sd<-sapply(bayesian, bayes_sd)
b_u<-bayesian+1.96*b_sd
b_l<-bayesian-1.96*b_sd
points(b_u, col="Red", pch=6)
points(b_l, col="Red", pch=6)

#Work out joint distributions

library(gtools)

sample<-rdirichlet(1000, dir)
diff_1_2<-sample[,1]-sample[,2]
hist(diff_1_2)
sum(diff_1_2>0)

diff_2_3<-sample[,2]-sample[,3]
hist(diff_2_3)
sum(diff_2_3>0)

diff_3_4<-sample[,3]-sample[,4]
hist(diff_3_4)
sum(diff_3_4>0)

diff_2_4<-sample[,2]-sample[,4]
hist(diff_2_4)
sum(diff_2_4>0)



