-- CreateTable
CREATE TABLE `appointments` (
    `apptid` INTEGER NOT NULL AUTO_INCREMENT,
    `doctorid` INTEGER NOT NULL,
    `patientid` INTEGER NOT NULL,
    `date` DATETIME(0) NOT NULL,
    `symptoms` TEXT NULL,
    `covidtest` BOOLEAN NULL,

    INDEX `patientid`(`patientid`),
    INDEX `doctorid`(`doctorid`),
    PRIMARY KEY (`apptid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `doctor` (
    `doctorid` INTEGER NOT NULL,
    `specialty` TEXT NOT NULL,
    `covidsupport` BOOLEAN NULL,
    `phone` INTEGER NULL,

    PRIMARY KEY (`doctorid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback` (
    `patientid` INTEGER NOT NULL,
    `doctorid` INTEGER NOT NULL,
    `written` TEXT NULL,
    `rating` INTEGER NULL,

    INDEX `doctorid`(`doctorid`),
    PRIMARY KEY (`patientid`, `doctorid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patientinsurance` (
    `patientid` INTEGER NOT NULL,
    `insuranceproviderid` INTEGER NOT NULL,
    `planid` INTEGER NOT NULL,

    INDEX `insuranceproviderid`(`insuranceproviderid`),
    INDEX `planid`(`planid`),
    PRIMARY KEY (`patientid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan` (
    `planid` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `monthlyrate` FLOAT NOT NULL,
    `deductible` FLOAT NOT NULL,
    `physiciancopay` FLOAT NULL,
    `pharmacopay` FLOAT NULL,

    PRIMARY KEY (`planid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `providerplan` (
    `insuranceproviderid` INTEGER NOT NULL,
    `planid` INTEGER NOT NULL,

    INDEX `planid`(`planid`),
    PRIMARY KEY (`insuranceproviderid`, `planid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `covidforms` (
    `apptid` INTEGER NOT NULL,
    `temp` BOOLEAN NULL,
    `cough` BOOLEAN NULL,
    `breathing` BOOLEAN NULL,
    `contact` BOOLEAN NULL,
    `travel` BOOLEAN NULL,

    PRIMARY KEY (`apptid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`doctorid`) REFERENCES `user`(`userid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`patientid`) REFERENCES `user`(`userid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `doctor` ADD CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`doctorid`) REFERENCES `user`(`userid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`doctorid`) REFERENCES `user`(`userid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`patientid`) REFERENCES `user`(`userid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `patientinsurance` ADD CONSTRAINT `patientinsurance_ibfk_1` FOREIGN KEY (`patientid`) REFERENCES `user`(`userid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `patientinsurance` ADD CONSTRAINT `patientinsurance_ibfk_2` FOREIGN KEY (`insuranceproviderid`) REFERENCES `user`(`userid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `patientinsurance` ADD CONSTRAINT `patientinsurance_ibfk_3` FOREIGN KEY (`planid`) REFERENCES `plan`(`planid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `providerplan` ADD CONSTRAINT `providerplan_ibfk_1` FOREIGN KEY (`insuranceproviderid`) REFERENCES `user`(`userid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `providerplan` ADD CONSTRAINT `providerplan_ibfk_2` FOREIGN KEY (`planid`) REFERENCES `plan`(`planid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `covidforms` ADD CONSTRAINT `covidforms_ibfk_1` FOREIGN KEY (`apptid`) REFERENCES `appointments`(`apptid`) ON DELETE NO ACTION ON UPDATE NO ACTION;
