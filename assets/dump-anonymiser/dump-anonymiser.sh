#!/bin/bash

# Config
mysql_username=${MYSQL_USERNAME:-root}
mysql_password=${MYSQL_PASSWORD:-root}
mysql_bin=${MYSQL_BIN:-"mysql"}
mysqldump_bin=${MYSQLDUMP_BIN:-"mysqldump"}

# hoisted vars
tmp_db_name="";

function generate_random_string () {
  # see: https://gist.github.com/earthgecko/3089509
  echo $(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1);
}

function generate_random_db_name () {
  echo "EntE_tmp_$(generate_random_string)"
}

function ellipsize () {
  input=$1;

  max_length=20;

  if [ ${#input} -le $max_length ]; then 
    echo $input;
  else
    first_few=$(printf $input | cut -c 1-9)
    last_few=$(echo $input | awk '{print substr($0, length($0)-12)}')
    echo "$first_few[...]$last_few";
  fi
}

function create_database () {
  printf "Creating database $tmp_db_name... "
  $mysql_bin -u $mysql_username -p$mysql_password -e "CREATE DATABASE IF NOT EXISTS \`$tmp_db_name\`;";
  printf "Done\n"
}

function import_dump () {
  input_file=$1;
  printf "Importing dump from $1 ... "
  $mysql_bin -u $mysql_username -p$mysql_password $tmp_db_name < $input_file
  printf "Done\n"
}

function drop_database () {
  printf "Dropping database $tmp_db_name... "
  $mysql_bin -u $mysql_username -p$mysql_password -e "DROP DATABASE \`$tmp_db_name\`;";
  printf "Done\n"
}

function write_dump () {
  out_file=$1
  printf "Writing to $out_file ... "
  $mysqldump_bin -u $mysql_username -p$mysql_password $tmp_db_name > $out_file;
  printf "Done\n"
}

function get_user_ids () {
  echo $($mysql_bin -u $mysql_username -p$mysql_password $tmp_db_name -N -e "
    SELECT _id FROM user;
  ");
}

function hash_to_int () {
  hash=$1
  echo $(cksum <<< $hash | cut -f 1 -d ' ')
}

IFS=$'\n' read -d '' -r -a first_names < ./firstnames.txt

function draw_firstname () {
  hash=$1
  echo ${first_names[$(hash_to_int $hash) % ${#first_names[@]} ]}
}

IFS=$'\n' read -d '' -r -a last_names < ./lastnames.txt

function draw_lastname () {
  hash=$1
  echo ${last_names[$(hash_to_int $hash) % ${#last_names[@]} ]}
}

function construct_username () {
  firstname=$1
  lastname=$2
  echo "$firstname.$lastname"
}

function construct_email () {
  firstname=$1
  lastname=$2
  echo "$firstname.$lastname@ente.app"
}

function anonymise_user () {
  user_id=$1;
  printf "Anonymising user $(ellipsize $user_id) ... "

  new_firstname=$(draw_firstname $user_id);
  new_lastname=$(draw_lastname $user_id);

  new_username=$(construct_username $new_firstname $new_lastname);
  new_email=$(construct_email $new_firstname $new_lastname);

  printf "$($mysql_bin -u $mysql_username -p$mysql_password $tmp_db_name -N -e "
    UPDATE user
    SET username = '$new_username',
        firstName = '$new_firstname',
        lastName = '$new_lastname',
        email = '$new_email',
        password = NULL
    WHERE _id = '$user_id';
  ")";

  printf "Done\n"
}

tmp_db_name=$(generate_random_db_name)

echo '--- Import Phase ----------'
create_database
import_dump $1

echo
echo '--- Anonymisation Phase ---'

printf "Querying user ids ... "
declare -a user_ids=($(get_user_ids))
printf "Done\n"

echo

# for every user
for uid in "${user_ids[@]}"
do
  anonymise_user $uid;
done

echo
echo '--- Write Phase -----------'

write_dump $2

echo
echo '--- Cleanup Phase ---------'

drop_database
