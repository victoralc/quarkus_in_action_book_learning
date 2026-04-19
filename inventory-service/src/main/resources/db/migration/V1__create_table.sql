create table Car
(
    id                 bigint not null auto_increment,
    licensePlateNumber varchar(255),
    manufacturer       varchar(255),
    model              varchar(255),
    primary key (id)
) engine=InnoDB;