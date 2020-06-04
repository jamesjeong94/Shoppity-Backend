CREATE KEYSPACE IF NOT EXISTS sdc
WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };

