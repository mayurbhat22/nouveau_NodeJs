const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllPlansByProvider(providerid) {
  const planids = await prisma.providerplan.findMany({
    where: { insuranceproviderid: providerid },
    select: {
      planid: true,
    },
  });

  let plans = [];
  for (let i = 0; i < planids.length; i++) {
    const plan = await prisma.plan.findFirst({
      where: { planid: planids[i].planid },
    });
    plans.push(plan);
  }

  return plans;
}

async function getPlanByPatient(patientid) {
  const patientplan = await prisma.patientinsurance.findFirst({
    where: { patientid: patientid },
  });

  if (patientplan === null) return patientplan;

  const plan = await prisma.plan.findFirst({
    where: { planid: patientplan.planid },
  });

  return plan;
}

async function getPlanById(planid) {
  const plan = await prisma.plan.findFirst({
    where: { planid: planid },
  });

  return plan;
}

// get plan info along with provider name and id
async function getPlanByPatientIdWithProviderInfo(patientid) {
  const patientplan = await prisma.patientinsurance.findFirst({
    where: { patientid: patientid },
  });

  if (patientplan === null) return patientplan;

  const plan = await prisma.plan.findFirst({
    where: { planid: patientplan.planid },
  });

  const provider = await prisma.user.findFirst({
    where: { userid: patientplan.insuranceproviderid },
  });

  plan["providerid"] = provider.userid;
  plan["providername"] = provider.name;

  return plan;
}

async function getAllPatientIdsByProvider(providerid) {
  const ids = await prisma.patientinsurance.findMany({
    where: { insuranceproviderid: providerid },
    select: {
      patientid: true,
    },
  });

  if (patientplan === null) return patientplan;

  const plan = await prisma.plan.findFirst({
    where: { planid: patientplan.patientid },
  });

  const provider = await prisma.user.findFirst({
    where: { userid: patientplan.insuranceproviderid },
  });

  plan["providerid"] = provider.userid;
  plan["providername"] = provider.name;

  return plan;
}

async function getAllPatientIdsByProvider(providerid) {
  const ids = await prisma.patientinsurance.findMany({
    where: { insuranceproviderid: providerid },
    select: {
      patientid: true,
    },
  });

  return ids;
}

// includes patient id and name and plan id and name
async function getAllPatientsAndPlansBasicByProvider(providerid) {
  const ids = await prisma.patientinsurance.findMany({
    where: { insuranceproviderid: providerid },
    select: {
      patientid: true,
      planid: true,
    },
  });

  let patients = [];
  for (let i = 0; i < ids.length; i++) {
    const patient = await prisma.user.findFirst({
      where: { userid: ids[i].patientid },
      select: {
        userid: true,
        name: true,
      },
    });
    patients.push(patient);
  }

  let plans = [];
  for (let i = 0; i < ids.length; i++) {
    const plan = await prisma.plan.findFirst({
      where: { planid: ids[i].planid },
      select: {
        planid: true,
        name: true,
      },
    });
    plans.push(plan);
  }

  let combos = [];
  for (let i = 0; i < ids.length; i++) {
    const combo = {
      patientid: patients[i].userid,
      patientname: patients[i].name,
      planid: plans[i].planid,
      planname: plans[i].name,
    };
    combos.push(combo);
  }

  return combos;
}


async function getAllPlans() {
    const plans = await prisma.plan.findMany();

    return plans;
}

async function getAllPlansWithProviderInfo() {
    const plans = await getAllPlans();

    for(let i=0; i<plans.length; i++) {
        const providerid = await prisma.providerplan.findFirst({
            where: {
                planid: plans[i].planid
            },
            select: {
                insuranceproviderid: true
            }
        })

        const provider = await prisma.user.findFirst({
            where: {
                userid: providerid.insuranceproviderid
            }
        })

        plans[i].providerid = provider.userid;
        plans[i].providername = provider.name;
    }

    return plans;
}  


async function getAllPlansGroupedByProvider() {
    const users = await prisma.user.findMany({
    })

    const providerids = []
    for (let i=0; i<users.length; i++) {
        if (users[i].role === 'insurance') {
            providerids.push(users[i]);
        }
    }

    const providerPlans = []

    for (let i=0; i<providerids.length; i++) {
        plans = await getAllPlansByProvider(providerids[i].userid)

        providerPlans.push({
            providerid: providerids[i].userid,
            providername: providerids[i].name,
            plans: plans
        })
    }

    return providerPlans;
}


async function updateInsuranceplan(plan) {
    const checkPlan = await prisma.providerplan.findFirst({
        where: {
            planid: plan.planid,
        }
    });

    if (checkPlan === null) {
        return "This plan doesn't exist"
    }

    if (checkPlan.insuranceproviderid !== plan.providerid) {
        return "This user does not own this plan"
    }

    const updatedPlan = await prisma.plan.update({
        where: {
            planid: plan.planid
        },
        data: {
            name: plan.name,
            monthlyrate: plan.monthlyrate,
            deductible: plan.deductible,
            physiciancopay: plan.physiciancopay,
            pharmacopay: plan.pharmacopay,
        }
    })


    return updatedPlan;
}


async function newInsuranceplan(plan) {
    const newPlan = await prisma.plan.create({
        data: {
            name: plan.name,
            monthlyrate: plan.monthlyrate,
            deductible: plan.deductible,
            physiciancopay: plan.physiciancopay,
            pharmacopay: plan.pharmacopay,
        }
    })

    const newRelation = await prisma.providerplan.create({
        data: {
            insuranceproviderid: plan.providerid,
            planid: newPlan.planid,
        }
    })

    return newPlan;
}


async function deleteInsuranceplan(planid, providerid) {
    const checkPlan = await prisma.providerplan.findFirst({
        where: {
            planid: planid,
        }
    });

    if (checkPlan === null) {
        return "This plan doesn't exist"
    }

    if (checkPlan.insuranceproviderid !== providerid) {
        return "This user does not own this plan"
    }


    const deletedRel = await prisma.providerplan.deleteMany({
        where: {
            planid: planid
        }
    })

    const deletedPat = await prisma.patientinsurance.deleteMany({
        where: {
            planid: planid
        }
    })

    const deleted = await prisma.plan.delete({
        where: {
            planid: planid
        }
    })


    return deleted;
}


async function patientSubscribeToPlan(patientid, planid) {
    const providerid = await prisma.providerplan.findFirst({
        where: {
            planid: planid
        },
        select: {
            insuranceproviderid: true
        }
    })

    const patientplan = await prisma.patientinsurance.findFirst({
        where: {
            patientid: patientid
        }
    })
    

    if(patientplan === null) {
        const add = await prisma.patientinsurance.create({
            data: {
                patientid: patientid,
                planid: planid,
                insuranceproviderid: providerid.insuranceproviderid
            }
        })

        return add;
    }

    const update = await prisma.patientinsurance.update({
        where: {
            patientid: patientid
        },
        data: {
            planid: planid,
            insuranceproviderid: providerid.insuranceproviderid
        }
    })

    return update
}


async function patientUnsubscribeFromPlan(patientid) {
    const check = await prisma.patientinsurance.findFirst({
        where: {
            patientid: patientid
        }
    })

    if (check === null) {
        return "You are not subscribed to a plan"
    }


    const removed = await prisma.patientinsurance.delete({
        where: {
            patientid: patientid
        }
    })

    return removed;
}




module.exports = {
  getAllPatientIdsByProvider,
  getAllPatientsAndPlansBasicByProvider,
  getAllPlansByProvider,
  getPlanById,
  getPlanByPatient,
  getPlanByPatientIdWithProviderInfo,
  getAllPlans,
  getAllPlansGroupedByProvider,
  getAllPlansWithProviderInfo,
  updateInsuranceplan,
  patientSubscribeToPlan,
  patientUnsubscribeFromPlan,
  deleteInsuranceplan,
  newInsuranceplan,
};
