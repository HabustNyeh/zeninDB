/**
    * ZeninDB
    * Please read file README.md and LICENSE
    * Please read LICENSE
    * Check Github for Update and Example
    * Github:
        * https://github.com/HabustNyeh/zeninDB
    * Email:
        * Razen@habustnyeh.xyz
        * or
        * bot@habustnyeh.xyz
    * Thanks For All
*/

'use strict';

const TAG_USER_JID = 's.whatsapp.net';
const TAG_GROUP_JID = 'g.us';

const fs = require('fs');
const { join } = require('path');
const P = require('pino')({ timestamp: Date.now()});
const error = (text) => { console.error(text); };
const info = (text) => { console.log(text); };
const debug = (text) => { P.debug(text); };
const warn = (text) => { P.warn(text); };
const trace = (text) => { P.trace(text); };

let defaultFolder = '';
let defaultObj;

const zeninDB = {
	sort: function sort(obj = {}) {
		return Object.fromEntries(Object.entries(obj).sort());
	},
	reverse: function reverse(obj = {}) {
		return Object.fromEntries(Object.entries(obj).reverse());
	},
	deleteString: function deleteString(txt) {
		if(typeof txt != 'string') {
			error(`Text deleteString is only string, not ${typeof txt}`);
			return false;
		}
		let noString;
		return noString;
	}, 
	reset: async function resetDB() {
		if(defaultFolder != ''){
			return await zeninDB.create(defaultFolder);
		}
	},
	setDefaultObject: function setDefaultObject(name, obj) {
		if(typeof name != 'string') {
			error(`'${name}' is not String`);
			return false;
		}
		if(typeof obj == 'object' && !Array.isArray(obj)) {
			if(typeof defaultObj == 'undefined') defaultObj = []
			defaultObj[name] = obj;
			return true;
		} else {
			error(`'${obj}' is not Object`);
			return false;
		}
	}, 
	create: function createDB(folder) {
		if(typeof defaultObj == 'undefined') {
			error('No Default Object set, use function setDefaultObject(name, {theObjForDefault})');
			return false;
		}
		defaultFolder = folder;
		if(!folder) {
			error('No folder');
			return false;
		}
		if(!fs.existsSync(folder)) {
			error('Folder not found,  Given Folder: '+folder);
			return false;
		}
		function isset(key) {
			if(typeof key == 'undefined') return false;
			else {
				return true;
			}
		}
		const userFolder = join(folder, 'user');
		const groupFolder = join(folder, 'chat');
		const existsUser = fs.existsSync(userFolder);
		const existsGroup = fs.existsSync(groupFolder);
		const listExists = [existsUser, existsGroup];
		const listFolder = [userFolder, groupFolder];
		if(!existsUser || !existsGroup) {
			const listError = [];
			for(let i=0; i<listExists.length; i++) {
				if(!listExists[i]) {
					try {
						fs.mkdirSync(listFolder[i]);
					} catch (e) {
						listError.push([listFolder[i], e]);
					}
				}
			}
			if(listError.length > 0){
				error(listError);
				return false;
			}
		}
				
		function dataOfData(nameOfData) {
			let dataResult = {};
			dataResult['getObject'] = function getObject(jid) {
				if(typeof nameOfData != 'undefined' && !jid.includes('@')) {
					error('Get Object: Jid only number@');
					return false;
				}
				if(typeof nameOfData != 'undefined' && nameOfData == 'user' && jid.split`@`[1] != TAG_USER_JID) {
					error('Get Object: This is User, give jid user!');
					return false;
				}
				let who = !isset(nameOfData) ? join(folder, jid+'.json') : join(folder, nameOfData, jid+'.json')
				if(!fs.existsSync(who)) {
					if(isset(nameOfData) &&!isset(defaultObj[nameOfData])) {
						error(`Default Obj for ${nameOfData} not found`);
						return false;
					}
					try {
						fs.writeFileSync(who, JSON.stringify(defaultObj[nameOfData], null, 2), 'utf8');
					} catch (e) {
						error(e);
						return false;
					}
				}
				return JSON.parse(fs.readFileSync(who, 'utf8'))
			}
			dataResult['setObject'] = function setObject(jid, data) {
				if(typeof nameOfData != 'undefined' && !jid.includes('@')) {
					error('Set Object: Jid only number@');
					return false;
				}
				if(typeof nameOfData != 'undefined' && nameOfData == 'user' && jid.split`@`[1] != TAG_USER_JID) {
					error('Set Object: This is User, give jid user!');
					return false;
				}
				if(typeof data != 'object' || Array.isArray(data)) {
					error('Data is { data } not [ data ] or data');
					return false;
				}
				let user = dataResult.getObject(jid);
				if(!user) return false;
				let who = !isset(nameOfData) ? join(folder, jid+'.json') : join(folder, nameOfData, jid+'.json')
				let newData = { ...user, ...data }
				fs.writeFileSync(who, JSON.stringify(newData, null, 2), 'utf8')
				return JSON.parse(fs.readFileSync(who, 'utf8'))
			}
			dataResult['addObject'] = function addObject(jid, data) {
				if(typeof nameOfData != 'undefined' && !jid.includes('@')) {
					error('Add Object: Jid only number@');
					return false;
				}
				if(typeof nameOfData != 'undefined' && nameOfData == 'user' && jid.split`@`[1] != TAG_USER_JID) {
					error('Add Object: This is User, give jid user!');
					return false;
				}
				if(typeof data != 'object' || Array.isArray(data)) {
					error('Data is { data } not [ data ] or data');
					return false;
				}
				let user = dataResult.getObject(jid);
				if(!user) return false;
				let who = !isset(nameOfData) ? join(folder, jid+'.json') : join(folder, nameOfData, jid+'.json')
				let userAK = Object.keys(user);
				let userAV = Object.values(user);
				let dataAK = Object.keys(data);
				let dataAV = Object.values(data);
				let datas = {}
				for(let iOfUserData =0; iOfUserData < dataAK.length; iOfUserData++) {
					let sD = dataAK[iOfUserData];
					if(userAK.includes(sD)){
						if(isNaN(dataAV[iOfUserData])){
							datas[sD] = user[sD] + ' ' + data[sD];
						} else {
							datas[sD] = user[sD] + data[sD];
						}
					} else {
						if(isNaN(dataAV[iOfUserData])){
							datas[sD] = user[sD] + ' ' + data[sD];
						} else {
							datas[sD] = user[sD] + data[sD];
						}
					}
				}
				let newData = { ...user, ...datas }
				info(newData)
				fs.writeFileSync(who, JSON.stringify(newData, null, 2), 'utf8')
				return JSON.parse(fs.readFileSync(who, 'utf8'))
			}
			dataResult['saveObject'] = function saveObject(jid, data) {
				if(typeof nameOfData != 'undefined' && !jid.includes('@')) {
					error('Save Object: Jid only number@');
					return false;
				}
				if(typeof nameOfData != 'undefined' && nameOfData == 'user' && jid.split`@`[1] != TAG_USER_JID) {
					error('Save Object: This is User, give jid user!');
					return false;
				}
				if(typeof data != 'object' || Array.isArray(data)) {
					error('Data is { data } not [ data ] or data');
					return false;
				}
				let who = !isset(nameOfData) ? join(folder, jid+'.json') : join(folder, nameOfData, jid+'.json')
				fs.writeFileSync(who, JSON.stringify(data, null, 2), 'utf8')
				return JSON.parse(fs.readFileSync(who, 'utf8'))
			}
			dataResult['add'] = function add(jid, key, value) {
				if(!isset(jid)) {
					error(`jid is null`);
					return false;
				}
				if(!isset(key) || !isset(value)) {
					error(`Key or value is null`);
					return false;
				}
				if(typeof nameOfData != 'undefined' && !jid.includes('@')) {
					error('Add: Jid only number@');
					return false;
				}
				if(typeof nameOfData != 'undefined' && nameOfData == 'user' && jid.split`@`[1] != TAG_USER_JID) {
					error('Add: This is User, give jid user!');
					return false;
				}
				if(Array.isArray(key) || Array.isArray(value)) {
					error('Given Array, expect string in key or value');
					return false;
				}
				let who = !isset(nameOfData) ? join(folder, jid+'.json') : join(folder, nameOfData, jid+'.json')
				let data;
				try {
					let datObj = {}
					datObj[key] = value;
					data = dataResult.addObject(jid, datObj);
				} catch (e) {
					error(e);
					return false;
				} finally {
					return data;
				}
			}
			dataResult['get'] = function get(jid, key) {
				if(!isset(jid)) {
					error(`jid is null`);
					return false;
				}
				if(!isset(key)) {
					error(`Key is null`);
					return false;
				}
				if(typeof nameOfData != 'undefined' && !jid.includes('@')) {
					error('Get: Jid only number@');
					return false;
				}
				if(typeof nameOfData != 'undefined' && nameOfData == 'user' && jid.split`@`[1] != TAG_USER_JID) {
					error('Get: This is User, give jid user!');
					return false;
				}
				if(Array.isArray(key)) {
					error('Given Array, expect string in key or value');
					return false;
				}
				let who = !isset(nameOfData) ? join(folder, jid+'.json') : join(folder, nameOfData, jid+'.json')
				let data;
				try {
					data = dataResult.getObject(jid);
				} catch (e) {
					error(e);
					return false;
				} finally {
					if(isset(data[key])) return data[key];
					else {
						error(`Key ${key} of User ${jid} is null`);
						return null
					}
				}
			}
			dataResult['getAll'] = function getAll(jid) {
				if(!isset(jid)) {
					error(`jid is null`);
					return false;
				}
				if(!isset(key)) {
					error(`Key is null`);
					return false;
				}
				if(typeof nameOfData != 'undefined' && !jid.includes('@')) {
					error('Get All: Jid only number@');
					return false;
				}
				if(typeof nameOfData != 'undefined' && nameOfData == 'user' && jid.split`@`[1] != TAG_USER_JID) {
					error('Get All: This is User, give jid user!');
					return false;
				}
				if(Array.isArray(key)) {
					error('Given Array, expect string in key');
					return false;
				}
				let who = !isset(nameOfData) ? join(folder, jid+'.json') : join(folder, nameOfData, jid+'.json')
				let data;
				try {
					data = dataResult.getObject(jid);
				} catch (e) {
					error(e);
					return false;
				} finally {
					return data;
				}
			}
			dataResult['getAllKey'] = function getAllKey(jid) {
				if(!isset(jid)) {
					error(`jid is null`);
					return false;
				}
				if(typeof nameOfData != 'undefined' && !jid.includes('@')) {
					error('Add: Jid only number@');
					return false;
				}
				let data;
				try {
					data = dataResult.getObject(jid);
				} catch (e) {
					error(e);
					return false;
				} finally {
					return Object.keys(data);
				}
			}
			dataResult['save'] = dataResult.saveObject;
			dataResult['set'] = function set(jid, key, value) {
				if(!isset(jid)) {
					error(`jid is null`);
					return false;
				}
				if(!isset(key) || !isset(value)) {
					error(`Key or value is null`);
					return false;
				}
				if(typeof nameOfData != 'undefined' && !jid.includes('@')) {
					error('Set: Jid only number@');
					return false;
				}
				if(typeof nameOfData != 'undefined' && nameOfData == 'user' && jid.split`@`[1] != TAG_USER_JID) {
					error('Set: This is User, give jid user!');
					return false;
				}
				if(Array.isArray(key) || Array.isArray(value)) {
					error('Given Array, expect string in key or value');
					return false;
				}
				let who = !isset(nameOfData) ? join(folder, jid+'.json') : join(folder, nameOfData, jid+'.json')
				let data;
				try {
					data = dataResult.getObject(jid);
				} catch (e) {
					error(e);
					return false;
				} finally {
					data[key] = value;
					return dataResult.save(jid, data);
				}
			}
			if(typeof nameOfData != 'undefined') {
				dataResult['getAllData'] = function getAll(doubleArray = false) {
					let listOfData = [];
					let listOfJid = dataResult.getAllJid();
					for(let iOfList=0; iOfList < listOfJid.length; iOfList++) {
						listOfData[listOfJid[iOfList]] = dataResult.getObject(listOfJid[iOfList]);
					}
					if(!doubleArray || !isset(doubleArray)) return listOfData;
					else {
						return Object.entries(listOfData);
					}
				}
				dataResult['getAllJid'] = function getAllJid(noTag = false) {
					let listOfFile = fs.readdirSync(join(folder, nameOfData))
					    .filter(file => file.endsWith('.json'))
					    .filter(file => !isNaN(file.split`@`[0]));
					if(noTag) return listOfFile.map(file => `${file.split`@`[0]}`)
					return listOfFile.map(file => `${file.split`.json`[0]}`) 
				}
				dataResult['import'] = function importDb(file, key) {
					let old = JSON.parse(fs.readFileSync(file, 'utf8')) 
					let listAdd = []
					let listDbOld = Object.entries(old[key])
					for(let iListDb = 0; iListDb < listDbOld.length; iListDb++) {
						if(listDbOld[iListDb].length < 2) {
							error(`Error, Database need key and value or 2 Key, expect ${listDbOld[iListDb].length}`);
							return false;
						}
						try {
							fs.writeFileSync(join(defaultFolder, nameOfData, listDbOld[iListDb][0]+'.json'), JSON.stringify(listDbOld[iListDb][1], null, 2), 'utf8');
						} catch (e) {
							error(`Key ${listDbOld[iListDb][0]} error in save data [${e}]`);
							listAdd[iListDb] = listDbOld[iListDb][0] + ` Error [${e}]`;
						} finally {
							listAdd[iListDb] = listDbOld[iListDb][0] + ' Success';
						}
					}
					console.log(listAdd.length) 
					if(listAdd.length < 1) {
						error(`No Data Added`);
						return false
					}
					return `${listAdd.length} Added, \n ${listAdd.map((key) => `${key}`).join('\n')}`
				}
			}
			return zeninDB.sort(dataResult);
		}
		
		let result = {
			addFolder: async function addFolder(name) {
				if(name.includes(folder)) name = name.replace(folder, '');
				if(name.includes('/')) name = name.replace('/', '');
				if(fs.existsSync(join(folder, name))) {
					error(`Folder ${name} exists`);
					return false;
				}
				try {
					fs.mkdirSync(join(folder, name));
					info('Success add database '+name+ ' restarting database...');
					return await zeninDB.reset();
				} catch (e) {
					error(e);
					return false;
				}
			},
			rmFolder: async function removeFolder(name) {
				if(name.includes(folder)) name = name.replace(folder, '');
				if(name.includes('/')) name = name.replace('/', '');
				if(!fs.existsSync(join(folder, name))) {
					error(`Folder ${name} not exists`);
					return false;
				}
				try {
					fs.rmdirSync(join(folder, name));
					info('Success delete database '+name+ ' restarting database...');
					return await zeninDB.reset();
				} catch (e) {
					error(e);
					return false;
				}
			},
			isset: isset, 
			addFile: async function addFile(name) {
				if(name.includes(folder)) name = name.replace(folder, '');
				if(name.includes('/')) name = name.replace('/', '');
				if(fs.existsSync(join(folder, name))) {
					error(`File ${name} exists`);
					return false;
				}
				try {
					fs.writeFileSync(join(folder, name), JSON.stringify({}, null, 2));
					info(`Success add file ${name} restarting database`);
					return await zeninDB.reset();
				} catch (e) {
					error(e);
					fs.unlinkSync(join(folder, name));
					return false;
				}
			},
			rmFile: async function removeFile(name) {
				if(name.includes(folder)) name = name.replace(folder, '');
				if(name.includes('/')) name = name.replace('/', '');
				if(!fs.existsSync(join(folder, name))) {
					error(`File ${name} not exists`);
					return false;
				}
				try {
					fs.unlinkSync(join(folder, name));
					info(`Success delete file ${name} restarting database`);
					return await zeninDB.reset();
				} catch (e) {
					error(e);
					return false;
				}
			},
			export: function exportDb(combine = false, file = 'database', without = []) {
				let res = {}
				let listOfFolder = fs.readdirSync(join(folder))
				    .filter(_folder => Object.keys(defaultObj).includes(_folder))
				    .filter(_folder => !without.includes(_folder))
				for(let _folder of listOfFolder) {
					res[_folder] = res[_folder] ?? {}
					let listOfFile = fs.readdirSync(join(folder, _folder))
					    .filter(_file => _file.endsWith('.json'))
					    .filter(file => !isNaN(file.split`@`[0]))
					for(let _file of listOfFile) {
						let file_ = _file.split('.json')[0]
						try {
							res[_folder][file_] = JSON.parse(fs.readFileSync(join(folder, _folder, _file), 'utf8'));
						} catch (e) {
							return 'Error: '+join(folder, _folder, _file) + '\n\n' + e
						}
					}
				}
				let sv = []
				if(combine) {
					fs.writeFileSync(join(folder, file +'.json'), JSON.stringify(res, null, 2))
					sv.push(join(folder, file +'.json'))
				} else {
					for(let _res of Object.keys(res)){
						fs.writeFileSync(join(folder, _res + '.json'), JSON.stringify(res[_res], null, 2))
						sv.push(join(folder, _res + '.json'))
					}
				}
				info(sv.map(_sv => `Save ${_sv}\n`))
				return sv.map(_sv => `Save ${_sv}\n`)
			}
		}
		
		let listDb = fs.readdirSync(folder)
		for(let iDb=0; iDb < listDb.length; iDb++){
			let stat = fs.lstatSync(join(folder, listDb[iDb]))
			if(stat.isDirectory()){
				result[listDb[iDb]] = dataOfData(listDb[iDb]);
			}
			if(stat.isFile()){
				result[listDb[iDb]] = dataOfData();
			}
		}
		return zeninDB.sort(result);
	}
}

module.exports = zeninDB.sort(zeninDB);
